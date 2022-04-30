import http from 'k6/http';
import { check, group, sleep, fail } from 'k6';

export let options = {
    vus: 1, // 1 user looping for 1 minute
    duration: '10s',

    thresholds: {
        http_req_duration: ['p(99)<1000'], // 99% of requests must complete below 1.0s
    },
};

const BASE_URL = 'https://soongjamm-infra-web.p-e.kr/';

export default function ()  {

    let homeRes = http.get(`${BASE_URL}`);

    check(homeRes, { 'status is 200': (r) => r.status == 200 });

    sleep(1);
};
