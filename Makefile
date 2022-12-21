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
	aws s3 sync ./build s3://dev-blocksniper.bunicorn.finance
	aws s3 sync ./build s3://dev-blocksniper.bunicorn.finance
	  rm -f ./build/index.html
	echo "Deploy client finished!"
	aws cloudfront create-invalidation \
        --distribution-id E38UEYF6YP6HN1 \
        --paths "/*"


deploy-prod:
	cp .env.prod.example .env
	npm run build
	echo "Uploading to s3"
	aws s3 sync ./build s3://blocksniper.bunicorn.finance
	aws s3 sync ./build s3://blocksniper.bunicorn.finance
	  rm -f ./build/index.html
	echo "Deploy client finished!"
	aws cloudfront create-invalidation \
        --distribution-id E1M4ONVP5M6DSW \
        --paths "/*"
