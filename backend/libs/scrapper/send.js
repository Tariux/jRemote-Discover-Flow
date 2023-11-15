const Parscoders = require('./module/Parscoders');


async function autoSend(username, password, skills, depth, message) {

    let ParscodersClass = new Parscoders(username, password)

    await ParscodersClass.lunchBid(skills, depth, message)


}

async function send() {

    let depth = 2;
    let message = 'درود امیدوارم حالتون خوب باشه؛ باعث افتخاره که من و تیمم توی انجام این پروژه همراهیتون کنیم!     جزئیات پروژتون مطالعه شد و در تیم ما متخصص هایی وجود دارند که بهترین راه حل هارو برای این موضوع دارن،   خوشحال میشیم که پیغام بدید و راجب جزئیات بیشتری از پروژه صحبت بکنیم قبل از شروع هرچیزی             نمونه کار دقیق تر راجب پروژه شما در صورت درخواستتون ارسال میشه!';

    let skills_code_lite = [
        'css', 'elementor', 'front-end', 'html', 'javascript', 'php', 'python', 'website-design', 'woocommerce', 'wordpress'

    ];
    let skills_code_full = [
        'ajax', 'amazon-web-services', 'android', 'angular', 'blog-design', 'css', 'debugging', 'django', 'elementor', 'figma', 'front-end', 'html', 'html5', 'instagram-bot', 'javascript', 'jquery', 'kotlin', 'laravel', 'next-js', 'nodejs', 'php', 'psd-to-html', 'python', 'react-native', 'reactjs', 'tailwind-css', 'telegram-bot', 'web-hosting-issues', 'web-scraping', 'web-search', 'web-security', 'website-design', 'website-management', 'woocommerce', 'wordpress'

    ];


    let skills_deisgn_lite = [ // Enter you skills like this here.
        'adobe-premiere', 'after-effects', 'banner-design', 'corel-draw', 'editing', 'graphic-design', 'illustrator', 'photoshop'
    ];
    let skills_deisgn_full = [ // Enter you skills like this here.
        'adobe-premiere', 'advertisement-design', 'after-effects', 'banner-design', 'concept-design', 'editing', 'illustrator', 'logo-design', 'photo-editing', 'photoshop', 'poster-design', 'product-design', 'video-editing'
    ];


    let skills_article_full = [ // Enter you skills like this here.
        'affiliate-marketing', 'article-rewriting', 'articles', 'content-creation', 'digital-marketing', 'excel', 'microsoft-office', 'powerpoint', 'product-descriptions', 'product-design', 'seo', 'translation', 'typing', 'word'
    ];


    while (true) {
        //await autoSend('09386230777', '34127020', skills_code_lite, depth * 2, message); // Send Bid to lite Code
        //await autoSend('aminsh8397@gmail.com', 'AMINsh1383', skills_deisgn_lite, depth * 2, message); // Send Bid to lite Design

        await autoSend('09386230777', '34127020', skills_code_full, depth, message); // Send Bid to full Code
        console.log('Waiting for new projects! , Working...');
        await autoSend('aminsh8397@gmail.com', 'AMINsh1383', skills_deisgn_full, depth, message); // Send Bid to full Design
        console.log('Waiting for new projects! , Working...');

        //await autoSend('09386230777', '34127020', skills_acc_2, depth, message); // Send Bid to full Article

    }


}

send()