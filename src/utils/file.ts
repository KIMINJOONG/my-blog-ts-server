export const checkImage = (tag: string) => {
    let pattern = /<img[^>]+>/i;
    let match = pattern.exec(tag);
    if (match) {
        console.log(match[0]);
    }
    // while ((match = pattern.exec(tag))) {
    //     console.log("111");
    // }
};
