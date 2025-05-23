install:
	cd backend && npm install
	cd frontend && npm install

backend:
	cd backend && npm run dev

frontend:
	cd frontend && npm start

start-backend:
	cmd /c start "Backend Server" "backend\start-backend.bat"

start-frontend:
	cmd /c start "Frontend Server" "frontend\start-frontend.bat"

start: start-backend start-frontend

clean:
	if exist output.txt del /f /q output.txt
	if exist backend\package-lock.json del /f /q backend\package-lock.json
	if exist frontend\package-lock.json del /f /q frontend\package-lock.json
	if exist backend\node_modules rmdir /s /q backend\node_modules
	if exist frontend\node_modules rmdir /s /q frontend\node_modules
	if exist backend\uploads rmdir /s /q backend\uploads

reinstall: clean install
