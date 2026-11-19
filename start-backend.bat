@echo off
echo Starting Northwind Management System Backend (Spring Boot)...
cd backend

if exist target\northwind-management-system-1.0.0.jar (
    echo Running packaged JAR with fast-tier startup...
    java -XX:+TieredCompilation -XX:TieredStopAtLevel=1 -jar target\northwind-management-system-1.0.0.jar
) else (
    where mvn >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        call mvn spring-boot:run
    ) else (
        echo [INFO] Running with Maven wrapper cache...
        call "%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.11\03d7e36a140982eea48e22c1dcac01d8862b2550b2939e09a0809bbc5182a5bc\bin\mvn.cmd" spring-boot:run
    )
)
pause
