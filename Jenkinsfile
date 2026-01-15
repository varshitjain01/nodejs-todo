pipeline {
    agent any

    environment {
        DOCKER = "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe"
        SONAR_HOST_URL = "https://sonarcloud.io"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/varshitjain01/nodejs-todo.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('ESLint') {
            steps {
                bat 'npx eslint .'
            }
        }

        stage('Unit Tests with Coverage') {
            steps {
                bat 'npm test'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'coverage/**', fingerprint: true
                }
            }
        }

        stage('SonarCloud Analysis') {
            environment {
                SONAR_TOKEN = credentials('sonarcloud-token')
            }
            steps {
                bat '''
                npx sonar-scanner ^
                  -Dsonar.projectKey=varshitjain01_nodejs-todo ^
                  -Dsonar.organization=varshitjain01 ^
                  -Dsonar.sources=. ^
                  -Dsonar.exclusions=__tests__/** ^
                  -Dsonar.tests=__tests__ ^
                  -Dsonar.exclusions=coverage/**,__tests__/**
                  -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info ^
                  -Dsonar.host.url=https://sonarcloud.io ^
                  -Dsonar.token=%SONAR_TOKEN%
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                bat '"%DOCKER%" build -t nodejs-todo .'
            }
        }

        stage('Trivy Image Scan') {
            steps {
                bat '''
                "%DOCKER%" run --rm ^
                  -v /var/run/docker.sock:/var/run/docker.sock ^
                  aquasec/trivy:latest ^
                  image nodejs-todo:latest
                '''
            }
        }

        stage('Deploy Container') {
            steps {
                bat '''
                "%DOCKER%" stop todo-container || exit 0
                "%DOCKER%" rm todo-container || exit 0
                "%DOCKER%" run -d -p 3000:3000 --name todo-container nodejs-todo
                '''
            }
        }
    }
}
