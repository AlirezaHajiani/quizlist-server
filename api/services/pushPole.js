var request = require('request');

var TOKEN = "8d58970517e2abf7cc4926bac5071aa5c9c0a3e2";

exports.pushGameTurn = (pushId,userName)=> {
                    let data={
                        "app_id": "com.lotusgames.quizlist",
                        "pids": [
                            pushId,
                        ],
                        "data": {
                            "title": "Quiz List-نوبت توئه",
                            "content": `کاربر ${userName} نوبت خودش رو بازی کرد`,
                            "show_app": true,
                            "action": {
                              "url": "",
                              "action_type": "A"
                            },
                        },
                        //"ttl": 86400,
                        // additional keywords -> https://push-pole.com/docs/api/#api_send_advance_notification
                    };
                    // console.log(data);
                    request.post(
                        {
                            uri: "https://api.push-pole.com/v2/messaging/rapid/",
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": "Token " + TOKEN,
                            },
                            body: JSON.stringify(data),
                        },
                        function (error, response, body) {

                            // if (response.statusCode == 201) {
                            //     console.log("Not Success!");
                            // } else {
                            //     console.log("Not Failed!");
                            // }
                        }
                    );
}

exports.pushGameChallenge = (pushId,userName)=> {
                    let data={
                        "app_id": "com.lotusgames.quizlist",
                        "pids": [
                            pushId,
                        ],
                        "data": {
                            "title": "Quiz List",
                            "content": `کاربر ${userName} تو رو به چالش دعوت کرد`,
                            "show_app": true,
                            "action": {
                              "url": "",
                              "action_type": "A"
                            },
                        },
                        //"ttl": 86400,
                        // additional keywords -> https://push-pole.com/docs/api/#api_send_advance_notification
                    };
                    // console.log(data);
                    request.post(
                        {
                            uri: "https://api.push-pole.com/v2/messaging/rapid/",
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": "Token " + TOKEN,
                            },
                            body: JSON.stringify(data),
                        },
                        function (error, response, body) {

                            // if (response.statusCode == 201) {
                            //     console.log("Not Success!");
                            // } else {
                            //     console.log("Not Failed!");
                            // }
                        }
                    );
}

exports.pushTimeLimit = (pushId,userName)=> {
                    let data={
                        "app_id": "com.lotusgames.quizlist",
                        "pids": [
                            pushId,
                        ],
                        "data": {
                            "title": "فقط یک ساعت فرصت داری",
                            "content": `بازیت با ${userName} داره وقتش تموم میشه`,
                            "show_app": true,
                            "action": {
                              "url": "",
                              "action_type": "A"
                            },
                        },
                        //"ttl": 86400,
                        // additional keywords -> https://push-pole.com/docs/api/#api_send_advance_notification
                    };
                    // console.log(data);
                    request.post(
                        {
                            uri: "https://api.push-pole.com/v2/messaging/rapid/",
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": "Token " + TOKEN,
                            },
                            body: JSON.stringify(data),
                        },
                        function (error, response, body) {

                            // if (response.statusCode == 201) {
                            //     console.log("Not Success!");
                            // } else {
                            //     console.log("Not Failed!");
                            // }
                        }
                    );
}

exports.pushTest = ()=> {
                    request.post(
                        {
                            uri: "https://api.push-pole.com/v2/messaging/rapid/",
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": "Token " + TOKEN,
                            },
                            body: JSON.stringify({
                                "app_id": "com.lotusgames.quizlist",
                                "pids":  ["pid_6d39-e0a6-36"],
                                "data": {
                                    "title": "Title",
                                    "content": "Content",
                                    "show_app": true,
                                    "action": {
                                      "url": "",
                                      "action_type": "A"
                                    },
                                },
                                //"ttl": 86400,
                                // additional keywords -> https://push-pole.com/docs/api/#api_send_advance_notification
                            }),
                        },
                        function (error, response, body) {
                            // console.log("status_code: " + response.statusCode);
                            // console.log("response: " + body);

                            if (response.statusCode == 201) {
                                // console.log("Success!");

                                // var data = JSON.parse(body);
                                // var report_url;
                                //
                                // // report url only generated on Non-Free plan
                                // if (data.hashed_id) {
                                //     report_url = "https://push-pole.com/report?id=" + data.hashed_id;
                                // } else {
                                //     report_url = "no report url for your plan";
                                // }
                                //
                                // console.log("report_url: " + report_url);
                                //
                                // console.log("notification id: " + data.wrapper_id);
                            } else {
                                console.log("failed!");
                            }
                        }
                    );
}
