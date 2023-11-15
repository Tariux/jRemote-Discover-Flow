import { useEffect, useState } from "react"

function AppConfig() {

    const [Profile, setProfile] = useState(false)

    useEffect(() => {
        fetchProfile();
    }, [])

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function fetchProfile() {


        const response = await fetch(`http://localhost:3030/db/get/`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
            },
        });

        const result = await response.json();
        if (result.db) {
            setProfile(result.db);
            return result.db;
        } else {
            return false;
        }
    }

    async function update(key_value, value) {

        if (!key_value || !value || value === "" || key_value === "") {
            return false;
        }

        await sleep(1000);

        const response = await fetch(`http://localhost:3030/db/append/?key_value=${encodeURIComponent(key_value)}&value=${encodeURIComponent(value)}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
            },
        });

        await sleep(1000);

        const result = await response.json();
        if (result.db) {
            return true;
        } else {
            return false;
        }


    }

    async function updateProfile() {

        try {
            await update("profile_username", document.getElementById("profile_username").value)
            await update("profile_password", document.getElementById("profile_password").value)
            await update("profile_bid_message", document.getElementById("profile_bid_message").value)
            await update("profile_bid_percentage", document.getElementById("profile_bid_percentage").value)
            await update("profile_bid_expire", document.getElementById("profile_bid_expire").value)
            await update("profile_telegram_token", document.getElementById("profile_telegram_token").value)
            await update("profile_telegram_chat_id", document.getElementById("profile_telegram_chat_id").value)
            await update("profile_google_script", document.getElementById("profile_google_script").value)

            document.getElementById("save_profile_status").innerHTML = "ذخیره اطلاعات با موفقیت انجام شد!"
        } catch (error) {
            console.log(error);
            document.getElementById("save_profile_status").innerHTML = "مشکلی در ذخیره اطلاعات پیش آمد!"
        }

    }
    return (
        <>
            <div className='app-config'>

                <label htmlFor="profile_username">نام کاربری</label>
                <input type="text" id="profile_username" name="profile_username" defaultValue={Profile.profile_username} />
                <label htmlFor="profile_password">کلمه عبور</label>
                <input type="password" id="profile_password" name="profile_password" defaultValue={Profile.profile_password} />


                <label htmlFor="profile_bid_message">متن پیام</label>
                <input type="text" id="profile_bid_message" name="profile_bid_message" defaultValue={Profile.profile_bid_message} />

                <div className="row" >
                    <div className="col-6">
                        <label htmlFor="profile_bid_percentage">درصد پیشنهاد</label>
                        <input type="text" id="profile_bid_percentage" name="profile_bid_percentage" defaultValue={Profile.profile_bid_percentage} />

                    </div>
                    <div className="col-6">
                        <label htmlFor="profile_bid_expire">مدت اعتبار پیشنهاد</label>
                        <input type="text" id="profile_bid_expire" name="profile_bid_expire" defaultValue={Profile.profile_bid_expire} />

                    </div>
                </div>


                <div className="row" >
                    <div className="col-6">
                        <label htmlFor="profile_telegram_token">توکن ربات تلگرام</label>
                        <input type="text" id="profile_telegram_token" name="profile_telegram_token" defaultValue={Profile.profile_telegram_token} />

                    </div>
                    <div className="col-6">
                        <label htmlFor="profile_telegram_chat_id">چت تلگرام</label>
                        <input type="text" id="profile_telegram_chat_id" name="profile_telegram_chat_id" defaultValue={Profile.profile_telegram_chat_id} />

                    </div>
                </div>


                <label htmlFor="profile_google_script">آدرس گوگل اسکریپت</label>
                <input type="text" id="profile_google_script" name="profile_google_script" defaultValue={Profile.profile_google_script} />



                <button type="submit" onClick={updateProfile}>ذخیره اطلاعات</button>
                <p className="center" id="save_profile_status"></p>

            </div>
            <div className='time'>
                <legend>
                    <span className="number">1401/02/01</span>تاریخ شمسی
                </legend>
                <legend>
                    <span className="number">918</span>پروژه جدید
                </legend>

            </div>
        </>
    )
}

export default AppConfig