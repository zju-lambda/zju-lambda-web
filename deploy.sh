#!/bin/bash
scp ci/ci.js ubuntu@zju-lambda.tech:/home/ubuntu
scp code-runner/code-runner.js ubuntu@zju-lambda.tech:/home/ubuntu
ssh ubuntu@zju-lambda.tech forever restart 0
ssh ubuntu@zju-lambda.tech forever restart 1