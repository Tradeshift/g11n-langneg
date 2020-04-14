// This Jenkinsfile uses the declarative syntax. If you need help, check:
// Overview and structure: https://jenkins.io/doc/book/pipeline/syntax/
// For plugins and steps:  https://jenkins.io/doc/pipeline/steps/
// For Github integration: https://github.com/jenkinsci/pipeline-github-plugin
// For credentials:        https://jenkins.io/doc/book/pipeline/jenkinsfile/#handling-credentials
// For credential IDs:     https://ci.ts.sv/credentials/store/system/domain/_/
// Docker:                 https://jenkins.io/doc/book/pipeline/docker/
// Custom commands:        https://github.com/Tradeshift/jenkinsfile-common/tree/master/vars
// Environment variables:  env.VARIABLE_NAME

pipeline {
    agent any // Or you could make the whole job or certain stages run inside docker
    triggers {
        issueCommentTrigger('^(retest|npm publish)$')
    }
    
    options {
        ansiColor('xterm')
        timestamps()
        timeout(time: 60, unit: 'MINUTES') // Kill the job if it gets stuck for too long
    }

    stages {
        stage('Initialise PR') {
            when { changeRequest() }
            steps {
                githubNotify(status: 'PENDING', context: 'semantic-release', description: 'Not analysed')
            }
        }

        stage('Clone') {
            steps {
                checkout scm
            }
        }

        stage('Setup nodejs') {
            steps {
                useNodeJS()
            }
        }

        stage('npm install') {
            steps {
                sh 'which node; node -v'
                sh 'which npm; npm -v'
                sh 'npm install'
            }
        }

        stage('Build and test') {
            steps {
                sh "npm run validate"
            }
            post {
                always {
                    checkstyle pattern:'build/checkstyle/*.xml', unstableTotalAll: '0', usePreviousBuildAsReference: true
                    junit testResults: 'build/junit/*.xml', allowEmptyResults: true
                }
            }
        }

        stage('npm publish') {
            when {
                changeRequest()
                expression { return pullRequest.comments.any { it.body == 'npm publish' } }
            }
            environment {
                NPM_TOKEN = credentials 'tradeshiftci-npm-readwrite-token'
                NPM_CONFIG_REGISTRY = 'https://npm.pkg.github.com/'
            }
            steps {
                npmPublish()
            }
        }

        stage('Semantic release') {
            environment {
                NPM_TOKEN = credentials 'tradeshiftci-npm-readwrite-token'
                NPM_CONFIG_REGISTRY = 'https://npm.pkg.github.com/'
            }
            steps {
                semanticVersion()
            }
        }

        stage('Sonarqube') {
            // If you use Typescript
            // sh 'npm install typescript'
            when {
                anyOf {
                    branch 'master' // Only run Sonarqube on master...
                    changeRequest() // ... and PRs
                }
            }
            steps {
                sonarqube()
            }
        }
    }
}

