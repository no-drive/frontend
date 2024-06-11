const scanner =require("sonarqube-scanner");

scanner.customScanner(
  {
    serverUrl: 'http://localhost:9000',
    token: 'sqp_0708f482577039b488c1be5f59c0bb6ff0ad8771', // Usa tu token de SonarQube aquí si es necesario
    options : {
      'sonar.projectKey': 'no-drive',
      'sonar.projectName': 'no-drive',
      'sonar.projectVersion': '1.0',
      'sonar.sources': 'src',
      'sonar.tests': 'tests',
      'sonar.sourceEncoding': 'UTF-8',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.inclusions': 'src/**/*.vue,src/**/*.js'
    },
  },
  () => process.exit()
);
