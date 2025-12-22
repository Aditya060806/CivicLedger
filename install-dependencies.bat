@echo off
echo Installing CivicLedger dependencies...

echo.
echo Installing frontend dependencies...
npm install

echo.
echo Installing additional AI dependencies...
npm install @google/generative-ai@^0.21.0

echo.
echo Installing development dependencies...
npm install --save-dev @types/google-generative-ai

echo.
echo All dependencies installed successfully!
echo.
echo To start the application:
echo 1. Run: npm run dev
echo 2. Open: http://localhost:8080
echo.
pause