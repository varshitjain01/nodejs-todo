pipeline {
    agent any

    environment {
        SONAR_HOST_URL = "https://sonarcloud.io"
        DOCKER = "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe"
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
                  -Dsonar.tests=__tests__ ^
                  -Dsonar.exclusions=coverage/**,__tests__/** ^
                  -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info ^
                  -Dsonar.host.url=https://sonarcloud.io ^
                  -Dsonar.token=%SONAR_TOKEN%
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                bat '"%DOCKER%" build -t nodejs-todo:latest .'
            }
        }

        stage('Trivy Image Scan') {
            steps {
                bat '''
                "%DOCKER%" run --rm ^
                  -v //var/run/docker.sock:/var/run/docker.sock ^
                  -v %WORKSPACE%:/workspace ^
                  aquasec/trivy:latest ^
                  image --scanners vuln ^
                  --severity HIGH ^
                  --exit-code 1 ^
                  --format json ^
                  -o /workspace/trivy-report.json ^
                  nodejs-todo:latest
                '''
            }
        }

        stage('Extract Vulnerability Details') {
            steps {
                script {
                    def report = readJSON file: 'trivy-report.json'
                    def highVulns = []

                    report.Results.each { result ->
                        if (result.Vulnerabilities) {
                            result.Vulnerabilities.each { vuln ->
                                if (vuln.Severity == "HIGH") {
                                    highVulns << "${vuln.VulnerabilityID} - ${vuln.PkgName}"
                                }
                            }
                        }
                    }

                    env.HIGH_COUNT = highVulns.size().toString()
                    env.TOP5 = highVulns.take(5).join("\n")
                }
            }
        }

        stage('Deploy Container') {
            steps {
                bat '''
                "%DOCKER%" stop todo-container || exit 0
                "%DOCKER%" rm todo-container || exit 0
                "%DOCKER%" run -d -p 3000:3000 --name todo-container nodejs-todo:latest
                '''
            }
        }
    }

    post {
        failure {
            emailext (
                subject: "⚠ HIGH Vulnerabilities Detected - Build ${BUILD_NUMBER}",
                body: """
Trivy Security Scan Report

Job Name: ${JOB_NAME}
Build Number: ${BUILD_NUMBER}

Total HIGH Vulnerabilities Found: ${env.HIGH_COUNT}

Top 5 HIGH Vulnerabilities:
${env.TOP5}

Full detailed report attached.

Please review immediately.
                """,
                attachmentsPattern: 'trivy-report.json',
                to: "varshit.18043@sakec.ac.in"
            )
        }
    }
}
