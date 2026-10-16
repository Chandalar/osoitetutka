# Osoitetutka PRO - Automaattinen Julkaisuskripti (GitHub Pages & osoitetutka.web.app)

Write-Host "Aloitetaan paivitysten julkaisu osoitteeseen https://osoitetutka.web.app ..." -ForegroundColor Cyan

# Pidetaan public/index.html synkassa juuren index.html kanssa
if (Test-Path "index.html") {
    New-Item -ItemType Directory -Force -Path "public" | Out-Null
    Copy-Item "index.html" "public/index.html" -Force
}

# 1. Tallenna ja tyonna GitHubiin (main & gh-pages)
git add .
git commit -m "Paivita Osoitetutka PRO (MML/WFS kiinteistorajat, Paavo-tilastot, lahipalvelut ja aurinkoanalyysi)"
git push origin main
git checkout -B gh-pages
git merge main
git push -f origin gh-pages
git checkout main

Write-Host "GitHub & GitHub Pages paivitetty!" -ForegroundColor Green

# 2. Julkaise Firebaseen (osoitetutka.web.app)
Write-Host "Julkaistaan osoitteeseen https://osoitetutka.web.app ..." -ForegroundColor Yellow
npx --yes firebase-tools deploy --only hosting:osoitetutka

Write-Host "Valmis! Sovellus julkaistu osoitteessa https://osoitetutka.web.app !" -ForegroundColor Green
