/**
 * External Dependencies
 */
import { __ } from "@wordpress/i18n";
import { PanelBody, PanelRow, TextControl } from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import Select2 from "react-select";
import AsyncSelect from "react-select/async";

/**
 * Internal Dependencies
 */
import { ORDER_BY, ORDER } from "./constants";
import { getProducts, getProductCategory, getProductTag } from "./apiData";
import ProSelectControl from "../pro-select-control"

export default function WoocommerceQuery(props) {
    const { queryData, setQueryResults, setAttributes, isEdit } = props;
    const [query, setQuery] = useState({});
    const [didMount, setDidMount] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);
    const [disableEdit, setDisableEdit] = useState(false);

    useEffect(() => {
        setDidMount(true);

        //If Exixsting query data exists in Attributes, set existing data to current query data
        if (
            typeof queryData != "undefined" &&
            Object.keys(queryData).length > 0
        ) {
            setQuery({
                ...queryData,
                source: "products",
                rest_base: "products",
                rest_namespace: "wc/v3",
            });
        } else {
            setQuery({
                source: "products",
                rest_base: "products",
                rest_namespace: "wc/v3",
                category: "",
                tag: "",
                per_page: "4",
                offset: "0",
                orderby: JSON.stringify([
                    {
                        label: __("Date", "essential-blocks"),
                        value: "date",
                    },
                ]),
                order: JSON.stringify([
                    {
                        label: __("Descending", "essential-blocks"),
                        value: "desc",
                    },
                ]),
            });
        }

        return () => {
            setDidMount(false);
        };
    }, []);

    useEffect(() => {
        //Get Post data on query change and set to Attributes
        if (didMount) {
            setDisableEdit(true);
            getProducts(query).then((posts) => {
                setAttributes({ queryData: query });
                setQueryResults(posts);
                setDisableEdit(false);
            });

            // If Component use in editor, don't run further
            if (isEdit) {
                return;
            }
        }
    }, [query]);

    const updateQuery = (selected, property, json, makeArray) => {
        const updateQuery = { ...query };
        updateQuery[property] =
            json && makeArray
                ? JSON.stringify([selected])
                : json
                    ? JSON.stringify(selected)
                    : selected;
        setQuery(updateQuery);
    };

    const updateIntegerQuery = (number, property) => {
        const updateQuery = { ...query };
        updateQuery[property] = number < 0 ? 0 : number;
        setQuery(updateQuery);
    };

    //Get Product Categories data and Set Product Categories Options Data
    const loadCategories = (value) => {
        if (typeof value === 'string' && value.length < 3) {
            return []
        }

        return getProductCategory(value).then((categoryData) => {
            let categoryDataForOptions = [];
            categoryData.length > 0 &&
                categoryData.forEach((item) => {
                    let filterCategoryData = {};
                    Object.keys(item).forEach((key) => {
                        if (key === "name") {
                            filterCategoryData.label = item[key];
                        }
                        if (key === "id") {
                            filterCategoryData.value = item[key];
                        }
                    });
                    categoryDataForOptions.push(filterCategoryData);
                });

            if (value.type === 'focus') {
                setCategoryOptions(categoryDataForOptions);
            }
            return categoryDataForOptions;
        });
    }

    const loadTags = (value) => {
        if (typeof value === 'string' && value.length < 3) {
            return []
        }

        return getProductTag(value).then((tagData) => {
            let tagDataForOptions = [];
            tagData.length > 0 &&
                tagData.forEach((item) => {
                    let filterTagData = {};
                    Object.keys(item).forEach((key) => {
                        if (key === "name") {
                            filterTagData.label = item[key];
                        }
                        if (key === "id") {
                            filterTagData.value = item[key];
                        }
                    });
                    tagDataForOptions.push(filterTagData);
                });

            if (value.type === 'focus') {
                setTagOptions(tagDataForOptions);
            }
            return tagDataForOptions;
        });
    }


    if (isEdit) {
        return null;
    }

    return (
        <PanelBody title={props.title} initialOpen={props.initialOpen}>
            {typeof query != "undefined" && didMount && (
                <>
                    <div className="eb-control-item-wrapper">
                        <PanelRow>
                            {__("Order By", "essential-blocks")}
                        </PanelRow>
                        <ProSelectControl
                            name="select-order-by"
                            value={
                                typeof query.orderby != "undefined" &&
                                    query.orderby.length > 0
                                    ? JSON.parse(query.orderby)
                                    : ""
                            }
                            onChange={(selected) =>
                                updateQuery(selected, "orderby", true, true)
                            }
                            options={ORDER_BY}
                            isMulti={false}
                            selectType={"select2"}
                        />
                    </div>
                    <div className="eb-control-item-wrapper">
                        <PanelRow>{__("Order", "essential-blocks")}</PanelRow>
                        <Select2
                            name="select-order"
                            value={
                                typeof query.order != "undefined" &&
                                    query.order.length > 0
                                    ? JSON.parse(query.order)
                                    : ""
                            }
                            onChange={(selected) =>
                                updateQuery(selected, "order", true, true)
                            }
                            options={ORDER}
                            isMulti={false}
                        />
                    </div>
                    <TextControl
                        label={__("Products Per Page", "essential-blocks")}
                        type={"number"}
                        value={query.per_page}
                        onChange={(selected) =>
                            updateIntegerQuery(selected, "per_page")
                        }
                    />
                    <TextControl
                        label={__("Offset", "essential-blocks")}
                        type={"number"}
                        value={query.offset}
                        onChange={(selected) =>
                            updateIntegerQuery(selected, "offset")
                        }
                    />
                    <div className="eb-control-item-wrapper">
                        <PanelRow>
                            {__("Product Categories", "essential-blocks")}
                        </PanelRow>
                        {/* <Select2
                            name="select-categories"
                            value={
                                typeof query.category != "undefined" &&
                                    query.category.length > 0
                                    ? JSON.parse(query.category)
                                    : ""
                            }
                            onChange={(selected) =>
                                updateQuery(selected, "category", true)
                            }
                            options={categoryOptions}
                            isMulti={true}
                        /> */}
                        <AsyncSelect
                            cacheOptions
                            value={
                                typeof query.category != "undefined" &&
                                    query.category.length > 0
                                    ? JSON.parse(query.category)
                                    : ""
                            }
                            defaultOptions={categoryOptions}
                            placeholder={__("Search Product Categories", "essential-blocks")}
                            loadOptions={loadCategories}
                            onChange={(selected) => updateQuery(selected, "category", true)}
                            isMulti="true"
                            isDisabled={disableEdit}
                            onFocus={loadCategories}
                        />
                    </div>
                    <div className="eb-control-item-wrapper">
                        <PanelRow>
                            {__("Product Tags", "essential-blocks")}
                        </PanelRow>
                        {/* <Select2
                            name="select-tags"
                            value={
                                typeof query.tag != "undefined" &&
                                    query.tag.length > 0
                                    ? JSON.parse(query.tag)
                                    : ""
                            }
                            onChange={(selected) =>
                                updateQuery(selected, "tag", true)
                            }
                            options={tagOptions}
                            isMulti={true}
                        /> */}

                        <AsyncSelect
                            cacheOptions
                            value={
                                typeof query.tag != "undefined" &&
                                    query.tag.length > 0
                                    ? JSON.parse(query.tag)
                                    : ""
                            }
                            defaultOptions={tagOptions}
                            placeholder={__("Search Product Tags", "essential-blocks")}
                            loadOptions={loadTags}
                            onChange={(selected) => updateQuery(selected, "tag", true)}
                            isMulti="true"
                            isDisabled={disableEdit}
                            onFocus={loadTags}
                        />
                    </div>
                </>
            )}
        </PanelBody>
    );
}
