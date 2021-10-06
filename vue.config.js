module.exports = {
    css: {
        loaderOptions: {
            sass: {
                additionalData: `
                    @import "@/styles/colors";
                    @import "@/styles/fonts";
            `
            }
        }
    }
};