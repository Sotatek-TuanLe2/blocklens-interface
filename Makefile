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

deploy:
	rsync -avhzL --delete \
				--no-perms --no-owner --no-group \
				--exclude .git \
				--exclude .idea \
				--exclude .env \
				./build $(u)@$(h):$(dir)/

deploy-dev:
	cp .env.dev.example .env
	npm run build
	make deploy u=sotatek h=172.16.199.28 dir=/home/sotatek/workspace/blocklens/blocklens-interface

deploy-stg:
	cp .env.dev.example .env
	npm run build
	echo "Uploading to s3"
	aws s3 sync ./build s3://stg-console.blocklens.io
	aws s3 sync ./build s3://stg-console.blocklens.io
	  rm -f ./build/index.html
	echo "Deploy client finished!"
	aws cloudfront create-invalidation \
        --distribution-id E2T117AFUGE3RH \
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
