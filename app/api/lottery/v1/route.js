import cheerio from 'cheerio';
import { NextResponse } from 'next/server';

export async function GET(req, res){
    const query = new URL(req.url).searchParams;
    // const { date, drawNo, slug } = query;

    if (!query.has('date') || !query.has('drawNo') || !query.has('slug')) {
        return NextResponse.json({ error: 'Missing parameters' },{status:400});
    }

    try{
        const scrapReq = await fetch('https://www.nlb.lk/English/results/mahajana-sampatha/5477',{
            method:'GET',
            headers:{
                "Cookie":"human=1010;"
            }
        })
        const htmlContent = await scrapReq.text()
    
        const $ = cheerio.load(htmlContent);
        const lotteryResults = [];
        $('.B li').each((index, element) => {
            const resultText = $(element).text().trim();
            if (resultText !== '' && resultText !== null) {
                lotteryResults.push(resultText);
            }
        });
    
        // Convert zodiac names to Sinhala
        switch (lotteryResults[0]) {
            case 'ARIES':
                lotteryResults[0] = 'mesha';
                break;
            case 'TAURUS':
                lotteryResults[0] = 'wushaba';
                break;
            // Add cases for other zodiac signs...
            default:
                break;
        }
    
        return NextResponse.json({result:lotteryResults})
    }catch(err){
        return NextResponse.json({ error: 'Internal server error' },{status:500});
    }
}