import apiFetch from "@wordpress/api-fetch";
const rootURL = EssentialBlocksLocalize?.rest_rootURL;
apiFetch.use(apiFetch.createRootURLMiddleware(rootURL));

//Get Categories
export const getProductCategory = (searchString = false) => {
    let categoryData = [];

    let queryString = "per_page=5";
    if (searchString && searchString.length > 2) {
        queryString = `search=${searchString}&per_page=10`
    }

    return apiFetch({ path: `/wc/v3/products/categories?${queryString}` }).then(
        (result) => {
            result != null &&
                result.length > 0 &&
                result.forEach((item) => {
                    let filterCategoryData = {};
                    let includesVal = ["id", "link", "name", "slug", "parent"];
                    Object.keys(item).forEach((key) => {
                        if (includesVal.includes(key)) {
                            filterCategoryData[key] = item[key];
                        }
                    });
                    categoryData = [...categoryData, filterCategoryData];
                });
            return categoryData;
        },
        (error) => {
            console.log("error", error);
        }
    );
};

//Get Tags
export const getProductTag = (searchString = false) => {
    let tagsData = [];

    let queryString = "per_page=5";
    if (searchString && searchString.length > 2) {
        queryString = `search=${searchString}&per_page=10`
    }

    return apiFetch({ path: `/wc/v3/products/tags?${queryString}` }).then(
        (result) => {
            result != null &&
                result.length > 0 &&
                result.forEach((item) => {
                    let filterTagsData = {};
                    let includesVal = ["id", "name", "slug"];
                    Object.keys(item).forEach((key) => {
                        if (includesVal.includes(key)) {
                            filterTagsData[key] = item[key];
                        }
                    });
                    tagsData = [...tagsData, filterTagsData];
                });
            return tagsData;
        },
        (error) => {
            console.log("error", error);
        }
    );
};

//Get Total Number of Posts
export const getNumberOfPosts = (query) => {
    const queryString = generateProductQueryString(query);
    return apiFetch({
        path: `/wp/v2/${query.source}?${queryString}`,
        parse: false,
    }).then(
        (result) => {
            return result.headers.get("X-WP-Total");
        },
        (error) => {
            console.log("error", error);
        }
    );
};

// Get WooCommerce Posts
//Get Posts
export const getProducts = (query) => {
    let updateQuery = { ...query };
    if (updateQuery.category) {
        let catIds = JSON.parse(updateQuery.category).map((item) => item.value);
        updateQuery["category"] = catIds;
    }
    if (updateQuery.tag) {
        let tagIds = JSON.parse(updateQuery.tag).map((item) => item.value);
        updateQuery["tag"] = tagIds;
    }

    const queryString = generateProductQueryString(updateQuery);
    let postData = [];
    return apiFetch({
        path: `/essential-blocks/v1/products?${queryString}`,
    }).then(
        (result) => {
            result != null &&
                result.length > 0 &&
                result.forEach((item) => {
                    let filterPostData = {};
                    Object.keys(item).forEach((key) => {
                        filterPostData[key] = item[key];
                    });
                    postData = [...postData, filterPostData];
                });
            return postData;
        },
        (error) => {
            console.log("error", error);
        }
    );
};

//------------------------------------------
//Helper Functions

//Check if the string is JSON or plain String
function jsonStringCheck(string) {
    try {
        var o = JSON.parse(string);
        if (o && typeof o === "object") {
            return true;
        }
    } catch (e) { }

    return false;
}

const generateProductQueryString = (query) => {
    let queryStringObj = {};
    Object.keys(query).forEach((key) => {
        if (query[key] && query[key].length > 0) {
            if (jsonStringCheck(query[key])) {
                let data = JSON.parse(query[key]);
                let arg = [];
                if (data.length > 0) {
                    data.forEach((eachData) => {
                        if (typeof eachData === "object") {
                            arg.push(eachData.value);
                        }
                    });
                    queryStringObj[key] = arg.join(",");
                }
            } else {
                if (query[key] !== "0") {
                    queryStringObj[key] = query[key];
                }
            }
        }
    });

    //Create Query String
    let queryString = Object.keys(queryStringObj)
        .map((key) => key + "=" + queryStringObj[key])
        .join("&");

    return queryString;
};
