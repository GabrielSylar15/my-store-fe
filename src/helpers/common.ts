import JSONBig from "json-big";

export const jsonDecode = (str: any) => {
    try {
        return JSONBig({storeAsString: true}).parse(str);
    } catch (error) {
        return null;
    }
};

export const jsonEncode = (data: any) => {
    try {
        return JSONBig({storeAsString: true}).stringify(data);
    } catch (error) {
        return null;
    }
};
