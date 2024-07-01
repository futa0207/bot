const { Client, GatewayIntentBits } = require('discord.js');
const RSSParser = require('rss-parser');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const parser = new RSSParser();

const YOUTUBE_RSS_FEEDS = [
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCy0DH4rgPPjDWVZO7wibcSQ', discordChannel: '1256532656083042397' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC_AoeaCVUk5afzONHvqFRjQ', discordChannel: '1256532670746329159' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCE4m8LkxKQc40Pr0YB4d-5w', discordChannel: '1256532683190833233' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC6YrjnlPcicwkJ6i5xd0F_Q', discordChannel: '1256532696562401311' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UChDD-mCbqd4182eI-T5wGbA', discordChannel: '1256532709757681674' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCKRZPvdUvIm1PsQ1nla2uCg', discordChannel: '1256532710835486721' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCONw_JcpiuvPpClHQi3CHXw', discordChannel: '1256546929798811648' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC2nsu1t4oDdukFwAJU0ULJw', discordChannel: '1256546968411570177' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCF98du_4WbnrpdzUlymoATg', discordChannel: '1256546985637580800' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCHyhPSrri4KBNg0zZ_xf21g', discordChannel: '1256547004725858376' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCMaI9kHZ6Ov1S7Pm5A0SSeQ', discordChannel: '1256547018562867272' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC4YwPX5-38lsN_rlzSgd5kw', discordChannel: '1256547033666289744' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC4n3W09rhSxiujb79v2Hqjw', discordChannel: '1256547055535521802' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCbECstWnFqR9Y8MN_uN4HfA', discordChannel: '1256549025700773889' },
    //以下サブチャンネル
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCdG4j43QBHRSfMEOYgT6RBw', discordChannel: '1256812289500385392' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCY9p616_34ZzJjdadXTH02A', discordChannel: '1256812303597305877' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC_B_SOChHUmoguykB6zNw1A', discordChannel: '1256812322882850816' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCEMFFrjygyGE5rEUp_yqwqw', discordChannel: '1256812346240798751' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCe70iWqAhqtjKUSbkSSJWsA', discordChannel: '1256812358815318037' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCnbMu9Tuv9q2OCpq7sCkLCQ', discordChannel: '1256812372144820255' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCeV1j9pzzVMsbMNAlbHNSjw', discordChannel: '1256812381883858975' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCwonZQfzB3EIlqvbUYhd2YA', discordChannel: '1256820779723522189' },
    { feed: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCYMyPkLbva8o5rFZLd0Dx_w', discordChannel: '1256909100747329566' },
    // 必要に応じてチャンネルを追加
];

const lastPublishedVideos = new Map();

const fetchLatestVideos = async () => {
    for (const { feed, discordChannel } of YOUTUBE_RSS_FEEDS) {
        try {
            const data = await parser.parseURL(feed);
            const latestVideo = data.items[0];
            const lastPublished = lastPublishedVideos.get(feed);

            if (!lastPublished || new Date(latestVideo.pubDate) > new Date(lastPublished)) {
                lastPublishedVideos.set(feed, latestVideo.pubDate);
                const message = `${data.title} の新着動画 -> ${latestVideo.title}\n${latestVideo.link}`;

                const channel = await client.channels.fetch(discordChannel);
                channel.send(message);
            }
        } catch (error) {
            console.error(`RSSフィードの取得エラー: ${feed}`, error);
        }
    }
};

client.once('ready', () => {
    console.log(`ログインしました：${client.user.tag}!`);
    fetchLatestVideos();
    setInterval(fetchLatestVideos, 10 * 60 * 100); // 1分ごとにチェック
});
process.on('SIGINT', () => {
    console.log('SIGINTシグナルを受信しました。処理を終了します');
    client.destroy(); // Discordクライアントをログアウトさせる（必要に応じて）
    process.exit(); // プロセスを終了する
});

client.login('');