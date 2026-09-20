import os
import sys
import urllib.parse
import urllib.request
from http.server import HTTPServer, SimpleHTTPRequestHandler
try:
    from http.server import ThreadingHTTPServer
except ImportError:
    ThreadingHTTPServer = HTTPServer

class RangeRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Range, Content-Type')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_head(self):
        # Standard file path handling with HTTP 206 Range support for instant seeking
        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            return super().send_head()

        return self.serve_file_with_range(path)

    def serve_file_with_range(self, path):
        file_size = os.path.getsize(path)
        range_header = self.headers.get('Range', '').strip()

        if not range_header or not range_header.startswith('bytes='):
            self.send_response(200)
            ctype = self.guess_type(path) or 'application/octet-stream'
            if path.endswith('.mp3'):
                ctype = 'audio/mpeg'
            self.send_header("Content-type", ctype)
            self.send_header("Content-Length", str(file_size))
            self.send_header("Last-Modified", self.date_time_string(os.path.getmtime(path)))
            self.end_headers()
            return open(path, 'rb')

        range_str = range_header[6:]
        start_str, _, end_str = range_str.partition('-')

        try:
            if start_str and end_str:
                start = int(start_str)
                end = int(end_str)
            elif start_str:
                start = int(start_str)
                end = file_size - 1
            elif end_str:
                start = max(0, file_size - int(end_str))
                end = file_size - 1
            else:
                self.send_response(200)
                ctype = self.guess_type(path) or 'audio/mpeg'
                self.send_header("Content-type", ctype)
                self.send_header("Content-Length", str(file_size))
                self.end_headers()
                return open(path, 'rb')
        except ValueError:
            self.send_error(400, "Invalid Range Header")
            return None

        if start >= file_size or end >= file_size or start > end:
            self.send_error(416, "Requested Range Not Satisfiable")
            return None

        self.send_response(206)
        ctype = self.guess_type(path) or 'application/octet-stream'
        if path.endswith('.mp3'):
            ctype = 'audio/mpeg'
        self.send_header("Content-type", ctype)
        self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Last-Modified", self.date_time_string(os.path.getmtime(path)))
        self.end_headers()

        f = open(path, 'rb')
        f.seek(start)

        class RangeFile:
            def __init__(self, f, length):
                self.f = f
                self.remaining = length

            def read(self, size=-1):
                if self.remaining <= 0:
                    return b""
                if size < 0 or size > self.remaining:
                    size = self.remaining
                data = self.f.read(size)
                self.remaining -= len(data)
                return data

            def close(self):
                self.f.close()

        return RangeFile(f, end - start + 1)

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8088
    directory = sys.argv[2] if len(sys.argv) > 2 else '.'
    os.chdir(directory)
    server = ThreadingHTTPServer(('0.0.0.0', port), RangeRequestHandler)
    print(f"Serving HTTP on 0.0.0.0 port {port} (Pure Offline & Range Streaming enabled) from {directory} ...")
    server.serve_forever()
