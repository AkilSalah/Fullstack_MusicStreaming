pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'akilmusic-app'
        DOCKER_TAG = "${BUILD_NUMBER}"
        SONAR_PROJECT_KEY = 'sonify'
    }

    tools {
        maven 'Maven'
        jdk 'JDK'
        dockerTool 'Docker'
    }

    stages {
            stage('Checkout') {
                steps {
                    echo "Checking out the code..."
                    checkout scm
                }
            }

            stage('Build') {
                steps {
                    echo "Building the application..."
                    sh 'mvn clean package -DskipTests'
                }
            }

            stage('Test') {
                steps {
                    echo "Running tests..."
                    sh 'mvn test'
                }
                post {
                    always {
                        junit '**/target/surefire-reports/*.xml'
                    }
                }
            }

            stage('Debug') {
                steps {
                    echo "Running Debug Info..."
                    sh 'printenv'
                    sh 'mvn --version'
                    sh 'docker --version'
                }
            }

            stage('Deploy') {
                steps {
                    echo "Deploying the app..."
                    sh '''
                        docker-compose down || true
                        docker-compose up -d
                    '''
                }
            }
        }

        post {
            always {
                echo "Cleaning workspace..."
                cleanWs()
            }
        }
    }