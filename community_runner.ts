
const membersList = [];
const activitiesList = [];
const pointsList = [];

const MAX_ACTIVE_CODES_NUMBER = 100;
const MAX_SAVED_MONEY_TODAY = 1000;
const MAX_VERIFIED_CODES_NUMBER = 100;

const activeCodesNumber = random(0, MAX_ACTIVE_CODES_NUMBER);
const savedMoneyToday = random(0, MAX_SAVED_MONEY_TODAY);
const verifiedCodesNumber = random(0, MAX_VERIFIED_CODES_NUMBER);


const VERIFICATION_STATUS_LIST = ['verified', 'invalid'];
const CODE_LIST = ['CODE1', 'CODE2', 'CODE3', 'CODE4', 'CODE5'];
const STORE_LIST = ['STORE1', 'STORE2', 'STORE3', 'STORE4', 'STORE5'];

function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function runCommunityActivity() {
    const ACTION_INTERVAL = random(1000, 5000); // 1s to 5s

    setInterval(() => {
        const newAction = generateNewAction(membersList[random(0, membersList.length - 1)]);

    }, ACTION_INTERVAL);


}

const generateNewAction = (memberName: string) => {
    const action = {
        id: random(1, 1000000),
        memberName: memberName,
        action: ACTION_LIST[random(0, ACTION_LIST.length - 1)],
        code: CODE_LIST[random(0, CODE_LIST.length - 1)],
        store: STORE_LIST[random(0, STORE_LIST.length - 1)],
        status: VERIFICATION_STATUS_LIST[random(0, VERIFICATION_STATUS_LIST.length - 1)],
    };
    return action;
}