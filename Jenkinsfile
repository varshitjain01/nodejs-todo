pipeline {
    agent any

    environment {
        DOCKER = "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe"
        SONAR_HOST_URL = "http://localhost:9000"
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

        stage('SonarQube Analysis') {
            environment {
                SONAR_TOKEN = credentials('sonar-token')
            }
            steps {
                bat '''
                npx sonar-scanner ^
                  -Dsonar.projectKey=nodejs-todo ^
                  -Dsonar.sources=. ^
                  -Dsonar.host.url=%SONAR_HOST_URL% ^
                  -Dsonar.token=%SONAR_TOKEN%
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                bat '"%DOCKER%" build -t nodejs-todo .'
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
