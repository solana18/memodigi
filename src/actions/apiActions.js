import Router from "next/router";
import { deleteAuthToken, getAuthToken, prepareUrl } from "@/helpers";
import { LOGIN_PATH, RESPONSE_OK } from "@/constants";
import axios from "axios";

const CONTENT_TYPES = {
    json: 'application/json',
    form: 'application/x-www-form-urlencoded',
    formData: 'multipart/form-data',
}

export const API_CALLS = {
    login:              { method: 'POST',   url: 'login', public: true },

    accountView:        { method: 'GET',    url: 'account-view/{accountUniqCode}', public: true },
    contentView:        { method: 'GET',    url: 'content-item/{contentUniqCode}', public: true },

    saveContent:        { method: 'POST',   url: 'account-content/save/{accountUniqCode}', public: true, paramsContentType: CONTENT_TYPES.formData },
    deleteContent:      { method: 'POST',   url: 'account-content/delete/{accountUniqCode}/{contentId}', public: true, paramsContentType: CONTENT_TYPES.formData },

    saveAccountDetailsNames: { method: 'POST',   url: 'account-edit/update-details-names/{accountUniqCode}', public: true, queryParams: true },
    saveAccountDetailsOther: { method: 'POST',   url: 'account-edit/update-details-other/{accountUniqCode}', public: true, queryParams: true },

}

export function callApiAction({ action,
                                data={},
                                urlParams = {},
                                withResponseStatus = true,
                                returnFirstResponse = false,
                                replaceAuthToken }) {

    const apiCallAction = API_CALLS[action];

    const authToken = replaceAuthToken || getAuthToken();

    if (!authToken && !apiCallAction.public) {
        console.log(`Empty authToken for action: ${action}`);
        return new Promise((resolve, reject) => {
            resolve([])
        });
    }
    let callConfig = {
        method: apiCallAction.method,
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    };
    if (!apiCallAction.public || replaceAuthToken) {
        callConfig = {
            ...callConfig,
            headers: {
                Authorization: authToken
            }
        }
    }
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(apiCallAction.method)) {
        let requestParams = null;
        // if (apiCallAction.paramsContentType === CONTENT_TYPES.form && data) {
        //     requestParams = new URLSearchParams();
        //     Object.keys(data).forEach(paramKey => {
        //         requestParams.append(paramKey, data[paramKey]);
        //     })
        // }
        if (apiCallAction.paramsContentType === CONTENT_TYPES.formData && data) {
            requestParams = data;
        }
        if ((!apiCallAction.paramsContentType || apiCallAction.paramsContentType === CONTENT_TYPES.json) && data) {
            requestParams = JSON.stringify(data);
        }
        callConfig = {
            ...callConfig,
            headers: {
                'Content-Type': apiCallAction.paramsContentType || CONTENT_TYPES.json,
                ...callConfig.headers
            },
            body: requestParams
        }
    }

    const url = `/${process.env.apiSlug}/${apiCallAction.url}`;

    return axios({
        method: apiCallAction.method,
        url: prepareUrl({ urlTemplate: url, urlParams, data, queryParams: apiCallAction.queryParams }),
        data: callConfig.body,
        headers: callConfig.headers,
    }).catch(async error => {
        console.log('error', error);
        if ([401, 403].includes(error.response?.status)) {
            console.log('Auth exception');
            deleteAuthToken();
            await Router.push(LOGIN_PATH);
        }
        // if ([404].includes(error.response?.status)) {
        //     console.log('404');
        //     return null;
        // }
        throw error;
    })

    // return fetch( prepareUrl({ urlTemplate: url, urlParams, data, queryParams: apiCallAction.queryParams }), callConfig )
    //     .then(async (response) => {
    //         if (returnFirstResponse) {
    //             return response;
    //         }
    //         if ([401, 403].includes(response?.status)) {
    //             deleteAuthToken();
    //             await Router.push(LOGIN_PATH);
    //             return { status: response?.status, body: null };
    //         }
    //         const text = await response?.text();
    //         let body = text.length ? JSON.parse(text) : {};
    //         if (withResponseStatus) {
    //             return { status: response?.status, body };
    //         }
    //         return body;
    //     }).then((response) => {
    //         if (response.status !== RESPONSE_OK) {
    //             throw response;
    //         }
    //         return response.body;
    //     }).catch(error => {
    //         console.log('error', error);
    //         throw error;
    //     })
}