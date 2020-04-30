 
# Adobe Primetime Authentication 

*Built by LATAM Team*

**Supports:** *TV, tvOS, FireTV and Samsung*
 
*Note: AndroidTV and FireTV share the same plugin*

## About

Adobe Primetime Authentication is a hosted service that serves as a proxy between programmers and MVPD's. It verifies users entitlement to content based on their TV Subscription.

***Note: Adobe Primetime Authentication needs a previous agreement between the client and Adobe. Adobe won't share any type of SDK's or access to the Clientless API unless the aformentioned agreemnet is on place.***

### What needs does it meet?

- Authentication, authorization and logout.
- Levels of entitlement.
- Seamless integration to MVPD's users db.

### When to use?

- Avoid development, infrastructure and/or integration for user workflows.
- Add different levels of entitlement based on type of Pay TV subscriptions.


## Configuration

Client has to aquire a license for Adobe Pass Authentication previous to any kind of configuration or addition of the plugin to an app.

### tvOS and Android TV (QuickBrick)

Both platforms make use of the **Clientless API**

#### Service Configuration

- Environment URL: Adobe environment to be used by the plugin.
  - Staging: api.auth-staging.adobe.com
  - Production: api.auth.adobe.com
- Resource ID: MVPD specific resource ID.
- Requestor ID: MVPD Adobe ID
- Secret key: MVPD secret key. Provided by Adobe.
- Public Key: MVPD private key. Provided by Adobe.
- Registration URL: Second Screen activation page URL. This URL should always match the environment in use (Staigng or Production).

![image\_2][plugin_config]

#### User Interface


![image\_2][plugin_ui]

### Android

Android implements the native Adobe SDK (AccessEnabler).

#### Service Configuration

- Base URL: Adobe environment to be used by the plugin.
  - Staging: sp.auth.adobe.com
  - Production: sp.auth-staging.adobe.com
- Token Validation URL: Endpoint specefied by Adobe to validate tokens(http://sp-prequal.auth.adobe.com/tvs/v1/validate).
- Software Statement: Created by the client through the Adobe's portal. The SS has to be created taking on account the client's domain and environment. 
- Resource ID: MVPD specific resource ID.
- Requestor ID: MVPD Adobe ID.
- Redirect URI: Reverse cleint's domain.

### User Interface

The plugin relays on a list view containing all MVPD's available to login. 

*MVPD's logos and names are acquired through Adobe's API; any change required by the client should be handled by Adobe itself.*

![image\_2][adobe_mvpd_list]

### iOS

iOS implements the native Adobe SDK (AccessEnabler).

#### Service Configuration

- Base URL: Adobe environment to be used by the plugin.
  - Staging: sp.auth.adobe.com
  - Production: sp.auth-staging.adobe.com
- Token Validation URL: Endpoint specefied by Adobe to validate tokens(http://sp-prequal.auth.adobe.com/tvs/v1/validate).
- Software Statement: Created by the client through the Adobe's portal. The SS has to be created taking on account the client's domain and environment. 
- Resource ID: MVPD specific resource ID.
- Requestor ID: MVPD Adobe ID.
- Redirect URI: Reverse cleint's domain.

### User Interface

The plugin relays on a list view containing all MVPD's available to login. 

*MVPD's logos and names are acquired through Adobe's API; any change required by the client should be handled by Adobe itself.*

# Contact Third Party
[Click Here](http://tve.helpdocsonline.com/home) to learn more about Adobe Primetime Authentication. 


### Pricing

[Click Here](https://www.adobe.com/request-consultation/experience-cloud.html) to learn more about Adobe Primetime Authentication. 


**Potential Future Features Include:**

Single Sing On (SSO): The user authenticates once through Adobe Primetime Authentication in one paticular platform. The user keeps the session open and can access content in other platforms without signing in again. This flow can work only if the other platform(s) are part of Adobe Primetime Authentication.


[plugin_config]: https://raw.githubusercontent.com/applicaster/latam-product-documentation/master/Adobe%20Updated/adobe_QB.png

[plugin_ui]: https://raw.githubusercontent.com/applicaster/latam-product-documentation/master/Adobe%20Updated/adobe_ui.png

[adobe_logout]: https://raw.githubusercontent.com/applicaster/latam-product-documentation/master/Adobe%20Updated/adobe_logout.png

[adobe_mvpd_list]: https://raw.githubusercontent.com/applicaster/latam-product-documentation/master/Adobe%20Updated/adobe_mvpd_list.png