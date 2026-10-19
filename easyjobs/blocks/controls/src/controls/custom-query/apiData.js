import apiFetch from "@wordpress/api-fetch";
import { select } from "@wordpress/data";
const rootURL = EssentialBlocksLocalize?.rest_rootURL;
apiFetch.use(apiFetch.createRootURLMiddleware(rootURL));

import { ebJsonStringCheck } from "../../helpers";

//Get Posts
export const getPosts = (query) => {
    const queryString = generateQueryString(query);
    const namespace = query.rest_namespace ? query.rest_namespace : "wp/v2";
    let postData = [];
    return apiFetch({
        path: `/${namespace}/${query.rest_base ? query.rest_base : "posts"
            }?${queryString}&_embed`,
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

//Get Author Data
export const getAuthor = (searchString = false) => {
    let authorData = [];
    let queryString = "per_page=5";
    if (searchString && searchString.length > 2) {
        queryString = `search=${searchString}&per_page=10`
    }
    return apiFetch({ path: `/wp/v2/users?${queryString}` }).then(
        (result) => {
            result != null &&
                result.length > 0 &&
                result.forEach((item) => {
                    let filterauthorData = {};
                    let includesVal = ["id", "link", "name", "slug"];
                    Object.keys(item).forEach((key) => {
                        if (includesVal.includes(key)) {
                            filterauthorData[key] = item[key];
                        }
                    });
                    authorData = [...authorData, filterauthorData];
                });
            return authorData;
        },
        (error) => {
            console.log("error", error);
        }
    );
};

//Get Taxonomies By Post Type
export const getTaxonomiesByPostType = (query) => {
    let taxonomies = [];
    return apiFetch({
        path: `/wp/v2/taxonomies?type=${query.source ? query.source : "post"
            }&per_page=-1`,
    }).then(
        (result) => {
            result != null &&
                Object.keys(result).length > 0 &&
                Object.keys(result).forEach((item) => {
                    let filterTaxonomoies = {};
                    let includesVal = [
                        "name",
                        "slug",
                        "rest_base",
                        "rest_namespace",
                    ];
                    Object.keys(result[item]).forEach((key) => {
                        if (includesVal.includes(key)) {
                            filterTaxonomoies[key] = result[item][key];
                        }
                    });
                    taxonomies.push(filterTaxonomoies);
                });
            return taxonomies;
        },
        (error) => {
            console.log("error", error);
        }
    );
};

//Get Categoryies By Post Taxonomies
export const getTaxonomyCategories = (taxonomyName, searchString = false) => {
    let taxonomies = [];
    let queryString = "per_page=5";
    if (searchString && searchString.length >= 2) {
        queryString = `search=${searchString}&per_page=10`
    }
    return apiFetch({ path: `/wp/v2/${taxonomyName}?${queryString}` }).then(
        (result) => {
            result != null &&
                Object.keys(result).length > 0 &&
                Object.keys(result).forEach((item) => {
                    let filterTaxonomoies = {};
                    Object.keys(result[item]).forEach((key) => {
                        if (key === "name") {
                            filterTaxonomoies.label = result[item][key];
                        }
                        if (key === "id") {
                            filterTaxonomoies.value = result[item][key];
                        }
                    });
                    taxonomies.push(filterTaxonomoies);
                });
            return taxonomies;
        },
        (error) => {
            console.log("error", error);
        }
    );
};

//Get Posts for Include or Exclude
export const getLatest5Posts = (query) => {
    const namespace = query.rest_namespace ? query.rest_namespace : "wp/v2";
    let data = [];
    return apiFetch({ path: `/${namespace}/${query.rest_base ? query.rest_base : "posts"}/?per_page=5` }).then(
        (result) => {
            result != null &&
                result.length > 0 &&
                result.forEach((item) => {
                    let filterData = {};
                    let includesVal = ["id", "title"];
                    Object.keys(item).forEach((key) => {
                        if (includesVal.includes(key)) {
                            filterData[key] = item[key];
                        }
                    });
                    data = [...data, filterData];
                });
            return data;
        },
        (error) => {
            console.log("error", error);
        }
    );
};

//Get Posts for Include or Exclude
export const getPostsBySearchString = (search, query) => {
    let postsData = [];
    const namespace = query.rest_namespace ? query.rest_namespace : "wp/v2";
    return apiFetch({ path: `/${namespace}/search/?search=${search}&type=post&subtype=${query.source ? query.source : "post"}` }).then(
        (result) => {
            result != null &&
                result.length > 0 &&
                result.forEach((item) => {
                    let filterPostsData = {};
                    let includesVal = ["id", "title"];
                    Object.keys(item).forEach((key) => {
                        if (includesVal.includes(key)) {
                            filterPostsData[key] = item[key];
                        }
                    });
                    postsData = [...postsData, filterPostsData];
                });
            return postsData;
        },
        (error) => {
            console.log("error", error);
        }
    );
};

//Get Total Number of Posts
export const getNumberOfPosts = (query) => {
    const queryString = generateQueryString(query);
    const namespace = query.rest_namespace ? query.rest_namespace : "wp/v2";
    return apiFetch({
        path: `/${namespace}/${query.rest_base ? query.rest_base : "posts"
            }?${queryString}`,
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

const generateQueryString = (query) => {
    let queryStringObj = {};
    Object.keys(query).forEach((key) => {
        const includeKeys = [
            "source",
            "sourceIndex",
            "author",
            "taxonomies",
            "per_page",
            "offset",
            "orderby",
            "order",
            "include",
            "exclude",
            "category",
            "tag",
            "exclude_current",
            "ignore_sticky_posts",
        ];
        if (includeKeys.includes(key)) {
            if (key === "taxonomies") {
                const taxonomies = query[key];
                if (
                    typeof taxonomies === "object" &&
                    Object.keys(taxonomies).length > 0
                ) {
                    Object.keys(taxonomies).map((item) => {
                        if (ebJsonStringCheck(taxonomies[item].value)) {
                            const valueObj = JSON.parse(taxonomies[item].value);
                            if (valueObj.length > 0) {
                                const valueArr = [];
                                typeof valueObj === "object" &&
                                    Object.keys(valueObj).map((val) => {
                                        valueArr.push(valueObj[val].value);
                                    });
                                queryStringObj[
                                    taxonomies[item].rest_base
                                ] = valueArr.join(",");
                            }
                        }
                    });
                }
            }
            if (query[key] && query[key].length > 0) {
                if (ebJsonStringCheck(query[key])) {
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
            if (key === "exclude_current" && query.exclude_current) {
                const currentPostId = select("core/editor")?.getCurrentPostId();
                if (typeof currentPostId === "number") {
                    if (queryStringObj.exclude) {
                        let update = queryStringObj.exclude.split(',')
                        if (update.indexOf(currentPostId.toString()) === -1) {
                            update.push(currentPostId.toString())
                        }
                        queryStringObj.exclude = update.join(',');
                    }
                    else {
                        queryStringObj.exclude = currentPostId.toString();
                    }
                }
            }

            if (key === "ignore_sticky_posts" && query.ignore_sticky_posts) {
                queryStringObj.sticky = !query.ignore_sticky_posts;
            }
        }
    });

    //Create Query String
    let queryString = Object.keys(queryStringObj)
        .map((key) => key + "=" + queryStringObj[key])
        .join("&");

    return queryString;
};


/**
 * Currently Unused Funcs
 */

//Get Categories
export const getCategory = () => {
    let categoryData = [];
    return apiFetch({ path: `/wp/v2/categories?per_page=-1` }).then(
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
export const getTag = () => {
    let tagsData = [];
    return apiFetch({ path: `/wp/v2/tags?per_page=-1` }).then(
        (result) => {
            result != null &&
                result.length > 0 &&
                result.forEach((item) => {
                    let filterTagsData = {};
                    let includesVal = ["id", "link", "name", "slug"];
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
