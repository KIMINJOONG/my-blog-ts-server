export const checkImage = (tag: string) => {
    console.log("heeloooo");
    const result = tag.match(/<img[^>]+>/i);
    console.log(result);
    if (result) {
        let img = result[0];
    }
};
