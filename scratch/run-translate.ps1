$apiKey = (Get-Content .env.local | Where-Object { $_ -match "NEXT_PUBLIC_GEMINI_API_KEY=" }) -replace "NEXT_PUBLIC_GEMINI_API_KEY=", ""
$env:GEMINI_API_KEY = $apiKey
Write-Host "API Key loaded: $($apiKey.Substring(0, 10))..."
node scratch/translate-ui-12langs.js
