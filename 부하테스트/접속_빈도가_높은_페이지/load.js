import http from 'k6/http';
import {check, sleep} from 'k6';
import { Counter } from "k6/metrics";

const vUserOnAverageTraffic = (23 * (1 * 1)) / 1;
const vUserOnMaxTraffic = (46 * (1 * 1)) / 1;

export let options = {
    stages: [
        {duration: '10s', target: vUserOnAverageTraffic}, // ramp up from 0 to average
        {duration: '10s', target: vUserOnAverageTraffic}, // average
        {duration: '25s', target: vUserOnMaxTraffic}, // average to max
        {duration: '40s', target: vUserOnMaxTraffic}, // max
        {duration: '25s', target: vUserOnAverageTraffic}, // ramp down from max to average
        {duration: '10s', target: vUserOnAverageTraffic}, // average
        {duration: '10s', target: 0}, // ramp down from average to 0 user
    ],
    thresholds: {
        http_req_duration: ['p(99)<1000'], // 99% of requests must complete below 1.0s
    },
};

const BASE_URL = 'https://soongjamm-infra-web.p-e.kr/';

export const errorRate = new Counter("errors");

export default function () {

    let homeRes = http.get(`${BASE_URL}`);

    let ok = check(homeRes, {'status is 200': (r) => r.status == 200});
    if (!ok) {
        errorRate.add("not ok")
    }
    sleep(1);
};