Ssh 에 추가해야할 것

npm ci
npm run build

추가하기
bottle-golfpeople-6ecbc1b568fd.json
.env
scheduler.sh

pm2 start npm --name "nodeServer" -- start

힙메모리 부족시
export NODE_OPTIONS=--max_old_space_size=4096
