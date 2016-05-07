const ImageResolver = require("image-resolver")
const async = require("async")

const resolver = new ImageResolver()

// Plugins registered for scraping
resolver.register(new ImageResolver.Opengraph());
resolver.register(new ImageResolver.MimeType());
resolver.register(new ImageResolver.FileExtension());
resolver.register(new ImageResolver.Webpage());

/*
 * helper function for forming the standard node callback
 * out of resolver.resove
 */
function resolve (url, callback) {
    resolver.resolve(url, function (result) {
        if (!url) {
            return callback(new Error("No url provided!"))
        }
        return callback(undefined, result)
    })
}

/*
 * resolveUrls
 * function to resolve more than one urls using an array argument
 */
function resolveUrls (urls, callback) {
    if (!urls || !urls[0]) {
        callback(new Error("No urls provided!"))
    }
    
    async.map(urls, resolve, callback)
}


/*
 * a private testResolution function
 * to test if the given code works as intended
 */
function testResolution () {
    var urls = [
        "https://github.com/mauricesvay/ImageResolver",
        "https://codebuddiesmeet.slack.com",
        "https://www.youtube.com/watch?v=DN4yLZB1vUQ",
        `http://news.google.com/news/url?sa=t&amp;fd=R&amp;ct2=us&amp;usg=AFQjCNHw3UVF96AwRTABQcCYbWvZM7B58g&amp;clid=c3a7d30bb8a4878e06b80cf16b898331&amp;cid=52779098443787&amp;ei=fu8tV6i9A9fv8AWdgJnYCg&amp;url=http://www.bloomberg.com/news/articles/2016-05-06/u-k-labour-party-s-sadiq-khan-wins-london-mayoral-election`,
        "http://dunyanews.tv/en/Pakistan/335717-Dr-Abdul-Malik-presents-himself-for-accountability"
    ]
    
    resolveUrls(urls, console.log)
}

module.exports = {
    resolve: resolve,
    resolveUrls: resolveUrls
}