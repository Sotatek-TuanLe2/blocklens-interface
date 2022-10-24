init:
	npm run docker-init

eslint:
	npm run docker-eslint

start:
	npm run docker-start

build:
	npm run docker-build

connect:
	npm run docker-connect

deploy-dev:
	cp .env.dev.example .env
	npm run build
	echo "Uploading to s3"
	aws s3 sync ./build s3://dev-blocklens.bunicorn.finance --exclude "index.html"
	aws s3 sync ./build s3://dev-blocklens.bunicorn.finance --exclude "index.html" --include "*.html"
	  rm -f ./build/index.html
	echo "Deploy client finished!"
	aws cloudfront create-invalidation \
        --distribution-id E1XGBM2NA65I5P \
        --paths "/" "/js/app.js" "/css/app.css" "/index.css"


deploy-prod:
	cp .env.prod.example .env
	npm run build
	echo "Uploading to s3"
	aws s3 sync ./build s3://dev-blocklens.bunicorn.finance --exclude "index.html"
	aws s3 sync ./build s3://dev-blocklens.bunicorn.finance --exclude "index.html" --include "*.html"
	  rm -f ./build/index.html
	echo "Deploy client finished!"
	aws cloudfront create-invalidation \
        --distribution-id E1XGBM2NA65I5P \
        --paths "/" "/js/app.js" "/css/app.css" "/index.css"
