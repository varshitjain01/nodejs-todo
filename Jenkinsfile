pipeline {
    agent any

    environment {
        DOCKER = "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/varshitjain01/nodejs-todo.git'
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
