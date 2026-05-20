param(
    [int]$Port = 8000
)

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
$listener.Start()
Write-Host "Serving HTTP on all interfaces:$Port"
Write-Host "Use http://<your-pc-ip>:$Port/ from another device."
Write-Host "Press Ctrl+C to stop."

function Get-ContentType($path) {
    switch ([System.IO.Path]::GetExtension($path).ToLowerInvariant()) {
        '.html' { 'text/html' }
        '.css'  { 'text/css' }
        '.js'   { 'application/javascript' }
        '.json' { 'application/json' }
        '.png'  { 'image/png' }
        '.jpg'  { 'image/jpeg' }
        '.jpeg' { 'image/jpeg' }
        '.gif'  { 'image/gif' }
        '.mp3'  { 'audio/mpeg' }
        '.mp4'  { 'video/mp4' }
        default { 'application/octet-stream' }
    }
}

while ($true) {
    $client = $listener.AcceptTcpClient()
    $stream = $client.GetStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $requestLine = $reader.ReadLine()
    if (-not $requestLine) {
        $stream.Close()
        $client.Close()
        continue
    }

    $parts = $requestLine.Split(' ')
    if ($parts.Length -lt 2) {
        $stream.Close()
        $client.Close()
        continue
    }

    $path = $parts[1].Split('?')[0].TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($path)) { $path = 'index.html' }
    $path = $path -replace '\\.\.', ''
    $localPath = Join-Path -Path (Split-Path -Parent $MyInvocation.MyCommand.Path) -ChildPath $path

    while (($line = $reader.ReadLine()) -ne '') { }

    if (-not (Test-Path $localPath -PathType Leaf)) {
        $body = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
        $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
        $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
        $stream.Write($headerBytes, 0, $headerBytes.Length)
        $stream.Write($body, 0, $body.Length)
        $stream.Close()
        $client.Close()
        continue
    }

    try {
        $bytes = [System.IO.File]::ReadAllBytes($localPath)
        $contentType = Get-ContentType $localPath
        $header = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
        $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
        $stream.Write($headerBytes, 0, $headerBytes.Length)
        $stream.Write($bytes, 0, $bytes.Length)
    } catch {
        $body = [System.Text.Encoding]::UTF8.GetBytes('500 Internal Server Error')
        $header = "HTTP/1.1 500 Internal Server Error`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
        $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
        $stream.Write($headerBytes, 0, $headerBytes.Length)
        $stream.Write($body, 0, $body.Length)
    }

    $stream.Close()
    $client.Close()
}
