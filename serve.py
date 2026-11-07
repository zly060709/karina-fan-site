from http.server import SimpleHTTPRequestHandler, HTTPServer

class H(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

HTTPServer(("127.0.0.1", 8099), H).serve_forever()
