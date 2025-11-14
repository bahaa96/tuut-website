import { useLanguage } from "../contexts/LanguageContext";
import { useEffect } from "react";

export function TermsPage() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const englishContent = `
### Accepting Terms of Use

Use of this Website tuut.shop ("tuut" "we" "our" "us") or any Website that replaces it or is added to it, including in the smartphone-enabled app (the "Website"), by you -the End User (the "End User" or "you"), submitting an offer to purchase, registering for the Website and/or opening an account on the Website constitutes an agreement to the following Terms of Use.

If you do not agree to the following Terms of Use ("Terms of Use" "Agreement"), you should refrain from using the Website.

We encourage you to re-read, from time to time, the Terms of Use and Privacy Policy to be up to date on changes.

You must be at least 18 years old to be eligible to use the Website.

You expressly consent to all the Terms of Use and Privacy Policy, and that you or anyone on your behalf will not make any claim against "tuut", the website owners, "tuut" managers, directors of "tuut", their agents, their affiliates and/or anyone on their behalf, other than claims related to breach of "tuut" obligations under the Terms of Use and Privacy Policy.

"tuut" reserves the right to change the Terms of Use from time to time, in its sole discretion. Any change will only apply to Coupons acquired after the change.

### Use of the Website

#### General

The Website provides a platform for merchants ("Merchants") to showcase discount Coupons for a specific web site and/or for that particular Offers ("Coupons"). "tuut" does not sell or provide the products or services presented on the Website, which may be purchased from the different businesses through the sale of Coupons. The products or services which can be used on Coupons sold on the Website are offered by the various businesses and not by "tuut".

The End User is solely responsible for protecting the confidentiality of the Website's password and/or anything related to it. You understand and agree that there may be interruptions in Website access or access to your account due to circumstances that are dependent on "tuut" as well as circumstances that are not dependent on "tuut". You hereby indemnify "tuut" for any damage and/or payment and/or loss you may incur as a result of the foregoing.

"tuut" will have the right, at any time, to change or any feature, including any content. "tuut" may stop disseminating any information, may change or discontinue any information transmission method. You hereby acknowledge that you are legally competent and legally sufficient to create a binding contract by law.

#### Changing Terms of Use and Privacy Policy

in addition to any notice permitted to be given under this Agreement, If "tuut" makes material changes to the Terms of Use, we shall provide you with a notification by email or by posting notice of the change to the Website. The changes in the Terms of Use and/or the Privacy Policy will apply immediately to all users of the Website. Your continued participation in this website will constitute your acceptance of such change. If the modifications are unacceptable to you, you may terminate using the Website. In addition, "tuut" may change, suspend or discontinue any aspect of an Offer or Link or remove, alter, or modify any tags, text, graphic or banner ad in connection with a Link.

#### End-User

Without derogating from the foregoing, "tuut" may prevent you from participating in any of the sales and/or offers, in part, in any of the following cases: if you have breached the Terms of Use. If you have committed an act or omission that may harm "tuut" or any third party, including the Company's clients, businesses and affiliates.

#### Intellectual Property, Copyright, and Trademarks

The Website is the sole property of "tuut". Any reproduction, distribution, transmission, posting, linking, or another modification of the Website without the express prior written consent of "tuut" is strictly prohibited.

Except as expressly stated herein, nothing in this Agreement is intended to grant you any rights to any of "tuut" trademarks, service marks, copyrights, patents or trade secrets. You agree that "tuut" may use any suggestion, comment or recommendation you choose to provide to "tuut" without compensation. All rights not expressly granted in this Agreement are reserved by "tuut".

#### Lack of responsibility

The End User hereby expressly agrees that the use of the Website is at its sole risk and risk. "tuut", its affiliates, employees, agents, affiliates, businesses, third parties providing content and licensors and all their directors, employees and agents do not represent or warrant that the use of the Website will be error free or shall be provided without interruption, nor shall they guarantee the accuracy, reliability of any information, service or Coupons provided through the Website.

"tuut" does not import, manufacture, market, sell and/or provide the product and/or service that you intend to purchase on the Website and therefore does not directly or indirectly bear any responsibility for the products, the products shipment and/or import into the country, their nature, their suitability and/or specification.

The products and services on the website are presented in good faith and under the responsibility of the business, and do not constitute a recommendation and/or opinion of the "tuut" regarding the nature of the products and/or services.

The Company will not be held liable for any illegal activity by the sale participants or any other party not under its full control. Without derogating from the foregoing, "tuut" will not be liable for any damage, whether direct or indirect, caused by use of the Website.

#### Indemnification

You hereby agree to indemnify, defend and hold harmless "tuut" and its Clients and their respective subsidiaries, affiliates, partners and licensors, shareholders, directors, officers, employees, owners and agents against any and all claims, actions, demands, liabilities, losses, damages, judgments, settlements, costs, and expenses (including reasonable attorney's fees and costs) based on (i) any failure or breach of this Agreement, including any breach of representation, warranty, covenant, restriction or obligation, (ii) any misuse by the End User of the Links, Coupons, Website and/or services or "tuut" intellectual property, or (iii) any claim related to any products or services, and the quality of any products or services.

#### Privacy

The End User hereby acknowledges that all discussions, ratings, comments, bulletin board service, chat rooms, and/or all messaging infrastructure, relays, and posts on the Website ("Communities") are public and not private, so third parties may read End User Communications Without his knowledge. "tuut" does not control or sponsor any content, message or information contained in any community and therefore "tuut" expressly disclaims any liability relating to communities and is not responsible for any consequences arising from the end user's participation in the communities. Any end-user information posted on the Website, whether in chat rooms, discussion rooms, message boards or otherwise, Is not information that is confidential. By posting comments, notices and/or other information on the Website, the End User grants "tuut" the right to use those comments, notices and/or other information for promotional, advertising, market research and for any other lawful purpose without limitation of territory, time Or any other restriction. For more information, please see "tuut"'s Privacy Policy.

#### Agreement Termination

"tuut" may terminate this Agreement at any time and for any reason and without cause, in its sole discretion and without having to notify the End User.

#### Third parties Content

The Website may contain links to third-party websites. These links are provided for your convenience only and do not imply endorsement by "tuut" of the content contained on such websites. The End User is aware that visiting a Web Website linked to on the Website may result in additional damages, including viruses, spyware, and other malware. If the end user decides to log on to a Web Website of A third party through a link appearing on the Website does so at his own risk and sole responsibility.

#### Emails

You hereby authorize "tuut" and/or anyone on its behalf to send you E-mails and messages. You also acknowledge and acknowledge that "tuut" may send you notices for the date of the expiry of the Coupon you have purchased.

In addition, by accepting these Terms of Use, you agree that "tuut" or anyone on its behalf may from time to time contact you with marketing and advertising offers, including through direct mail, text messages, text messages, e-mail correspondence, push notifications In the website app, or through any other means of communication.

#### Coupons- General

All Coupons from the Website or through the Website, including any Website linked to "tuut" (the "Coupons") are promotional Coupons which can be purchased from "tuut" in order to replace them with products and/or services at a discount to their regular price (not Including various discounts that the business gives from time to time). The Coupons can be purchased on the Website and in accordance with the terms and conditions applicable to each transaction and each business.

"tuut" allows you to purchase Coupons that can be redeemed in connection with the purchase of products and/or services from the business, subject to these Terms of Use and the relevant terms of the transaction. The businesses that provide the products/services are not "tuut", providing the relevant products and services is the sole responsibility of the different businesses.

#### Coupon purchase

"tuut" may, as well as any business, increase or decrease the minimum quantity during the sale of any Coupon. The purchase of the Coupons will constitute a limited contractual right to exercise the Coupons vis-à-vis the business that issued the Coupons only, which is subject to "tuut"'s contractual rights vis-à-vis that business Terms and Conditions.

For more information about "tuut" end-user personal information collection, please see "tuut"'s Privacy Policy.

#### The Coupons rights

The rights granted to each Coupon will be governed by the terms of each business providing the product/service and the terms of each specific Coupon, as they may appear from time to time on the Website and/or on the Coupon, in any case of conflict between the terms displayed on the Website and the Coupon, "tuut" shall have the absolute right to decide on what terms of use apply.

#### The products/services listed on the Website

"tuut" does not sell and/or provide the products and/or services presented on the Website. "tuut" provides the businesses within the Website as a platform for displaying and selling the products and services, using various sales methods. The sales page for each product and product showcases the specific terms for selling the product as provided by the various businesses.

The product images on the Website are for illustration purposes only and there may be differences between the product/service image and the product/service sold. Any information about the products including the price of the products are provided by the products/services providers. The responsibility for the information, its nature, and its reliability, therefore, rests entirely with the products/services providers.

#### Website registration

You must register on our website. You must accurately complete the registration form and not use any aliases or other means to mask your true identity or contact information. By entering these details you declare that these are your details and that they are correct, accurate and complete and that you own the credit card, e-mail, and telephone line. We may accept or reject your application at our sole discretion for any reason and will be under no obligation to provide you with any justification for our decision. "tuut" and/or the products/services providers reserve the right to cancel your participation/purchase for any reason at any time and without requiring reason, due to the submission of false, partial or inaccurate details.

#### Payment

All Prices shown in all sales methods include VAT, as required by law, unless otherwise explicitly stated.

#### Supply of products

Products/Services will be delivered in accordance with the terms of these Terms of Use and the Product/Service Coupons Sales Page. The Products/Services will be delivered by the products/services providers and under their sole responsibility in accordance with the terms set forth in these Terms of Use and the Coupon Sales Page for the product/service on the Website.

#### Redeem Coupons

No Coupons can be exercised more than once. Unless specifically stated otherwise, Coupons use may not be combined with other coupons, discounts, offers, and/or other promotions and no multiple offers will apply.

Coupons cannot be used to pay off a previous debt to the business or to pay a tip unless otherwise expressly stated.

"tuut" and the products/services providers will not be liable for loss and/or theft and/or duplication and/or printing of the remaining Coupons and/or serial numbers.

Any attempt to use the Coupons in contravention of the terms set forth below or contrary to the terms that appear in the Coupon/Sale page on the website invalidate the Coupons.

All Coupons are limited in time so that after the Coupons's validity period, no Coupons can be used and the Coupons will not give the Coupons buyer any right of any kind nor will he be entitled to a refund, subject to any law. It is the End User sole responsibility to use the Coupons during the Coupon validity period.

If the time limit for redeeming the Coupons is not specified in the sale page, the Coupons will expire after six months from the date of the purchase.

In cases where Coupons are not used until its expiry date, the amount paid for the Coupons purchase will be transferred to the products/services providers or to the "tuut", in accordance with the agreements between "tuut" and the products/services providers.

#### Cancel a transaction by "tuut"

"tuut" and/or anyone on its behalf reserves the right to cease its operation at any time, and/or cancel a sale (before or after closing), including in any of the following cases:

1. Illegal activity has been or is taking place on the Website.
2. If there was a technical malfunction.
3. In the event of a force majeure, war or terror that prevents "tuut" its line of business.
4. Any action taken in violation of these Terms of Use.

#### Products/services providers responsibility

The products/services providers will be solely responsible for any injury, illness, damage, claim, claim, liability, loss of pocket, loss, expense and/or any other payment that the end user may incur in connection with the Coupons.

#### Coupons for business transactions outside of the United Arab Emirates

1. From time to time "tuut" Coupons may appear on the website for services or products outside of the United Arab Emirates.

2. For the avoidance of doubt, it will be made clear that the purchase of Coupons for overseas transactions will be governed by these Terms and Conditions of Use.

3. When purchasing Coupons for overseas transactions, the End User declares that he understands and agrees to the following terms:

a. "tuut" does not sell and/or provide the products and/or services specified in Coupons for overseas transactions, but merely liaises between the buyer and the local products/services providers. "tuut" is not responsible for the nature of the product and/or service provided by the products/services providers.

b. It is made clear that "tuut" will not be held liable for failure to redeem the Coupons due to any change in any kind and for any reason in the End User's overseas travel plans, whether the change in plans was made by the buyer or caused by external circumstances.

c. It is stated that "tuut" will not be liable to the End User, in any form or way, and will not be liable for any damage, direct or indirect, which may be caused to the End User for failure to comply with the products/services providers undertaking towards the End User, including damages resulting from delays, deliveries of products or service exceeding what is stated in the Coupons.

d. "tuut" will not be liable, directly or indirectly, for any damage to the body or property which may be caused to the End User as a result of using the Coupon, direct or indirect damage and/or loss, any damage or loss due to force majeure.

e. It is made clear that the End User will not be entitled to a refund and/or compensation for failure to use the Coupons and/or in part, for any reason.

f. The local products/services providers may propose to the End User to purchase additional products or services not included in the Coupons. In such cases, the End User will execute the purchase of the additional products or services directly in front of the products/services providers and "tuut" will have no responsibility for these products or services or for any transaction under which it is purchased.

g. It is the End User's responsibility to ensure, that he has all the insurance and permissions/licenses required to redeem the Coupons. It is clarified that "tuut" will not be liable for any damage caused by the absence of appropriate insurance when the Coupons are redeemed for transactions abroad.

h. The End User must keep the Coupons and present them to the products/services providers.

i. The Coupons amount may be added to local tax or other compulsory payments. These payments will be paid by the End User directly to the business. The End User is responsible for clarifying and checking the existence of such payments.

j. In any case of dispute or dispute between the End User and the local products/services provider, the law of the State in which the business is located shall govern, unless otherwise expressly stated on the Coupons. It is clarified that "tuut" shall have no part in any such legal proceedings.

#### Disclaimers

THE WEBSITE, LINKS, COUPONS, GRAPHICS OR OTHER MATERIALS PROVIDED, THE CONTENT INCLUDED THEREIN, AND THE PRODUCTS AND SERVICES PROVIDED IN CONNECTION THEREWITH OR OTHERWISE BY "TUUT", ARE PROVIDED TO END USER AS IS. EXCEPT AS EXPRESSLY SET FORTH HEREIN, "TUUT" EXPRESSLY DISCLAIMS ALL WARRANTIES, EXPRESS, IMPLIED OR STATUTORY, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF COURSE OF DEALING, USAGE, OR TRADE.

#### Limitation of Liability

IN NO EVENT SHALL "TUUT" BE LIABLE FOR ANY UNAVAILABILITY OR INOPERABILITY OF THE LINKS, COUPONS, PROGRAM WEB SITES, TECHNICAL MALFUNCTION, COMPUTER ERROR, CORRUPTION OR LOSS OF INFORMATION, OR OTHER INJURY, DAMAGE OR DISRUPTION OF ANY KIND. IN NO EVENT WILL "TUUT" BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, PERSONAL INJURY / WRONGFUL DEATH, SPECIAL OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO, LOSS OF PROFITS OR LOSS OF BUSINESS OPPORTUNITY, LOSS OF DATA OR CUSTOMERS, EVEN IF SUCH DAMAGES ARE FORESEEABLE AND WHETHER OR NOT "TUUT" HAS BEEN ADVISED OF THE POSSIBILITY THEREOF.

#### Governing Law

The laws of the United Arab Emirates shall govern this Agreement, and the Parties hereby submit to the jurisdiction of the competent courts of Dubai, United Arab Emirates in any matter arising out of or relating to this Agreement.

#### Miscellaneous

Without derogating from the provisions of the above, the End User and the products/services providers shall be responsible for the payment of all attorney fees and expenses incurred by "tuut" to enforce the terms of this Agreement. This Agreement, together with the Privacy Policy, contains the entire agreement between "tuut" and the End User with respect to the subject matter hereof and supersedes all prior and/or contemporaneous agreements or understandings, written or oral.

If any provision of this Agreement is held to be void, invalid or inoperative, the remaining provisions of this Agreement shall continue in effect and the invalid portion of any provision shall be deemed modified to the least degree necessary to remedy such invalidity while retaining the original intent of the parties.

Each party to this Agreement is an independent contractor in relation to the other party with respect to all matters arising under this Agreement. Nothing herein shall be deemed to establish a partnership, joint venture, association or employment relationship between the parties.

No course of dealing nor any delay in exercising any rights hereunder shall operate as a waiver of any such rights.

No waiver of any default or breach shall be deemed a continuing waiver or a waiver of any other breach or default.

By using the Website, you affirm and acknowledge that you have read this Agreement in its entirety and agree to be bound by all of its terms and conditions. If you do not wish to be bound by this Agreement, you should not use the Website.

#### Contact Information

If you have any questions about these Terms and Conditions, please contact us at:
• Email: support@tuut.shop
• Website: tuut.shop

Last updated: ${new Date().toLocaleDateString()}
  `;

  const arabicContent = `
### قبول شروط الاستخدام

استخدام هذا الموقع الإلكتروني tuut.shop (يُشار إليه لاحقًا بـ "تووت" أو "نحن" أو "الخاص بنا" أو الضمير المتصل "نا" الذي يدلّ علينا) أو أي موقع إلكتروني بديل له أو يُضاف إليه، يشمل التطبيق الخاص بنا للهواتف الذكية (يُشار إليه بـ "الموقع الإلكتروني")، من قِبَلك أنت (يُشار إليك بـ "المستخدِم" أو "أنت" أو أي ضمير متصل نخاطبك فيه)، أو تقديم عرض للشّراء، التّسجيل في الموقع و/أو إنشاء حساب في الموقع، يشكّل اتفاقية بيننا ويؤكّد موافقتك على شروط الاستخدام التالية وقبولك بها.

إذا كنت لا توافق على شروط الاستخدام التالية (يُشار إليها بـ "شروط الاستخدام" أو "اتفاقية")، فينبغي عليك الامتناع عن استخدام الموقع الإلكتروني.

من المفضّل أن تقوم من حينٍ لآخر بقراءة شروط الاستخدام وسياسة الخصوصية الخاصة بنا كي تبقى مطّلعًا على جميع التعديلات والتغييرات.

يجب أن يكون عمرك 18 عامًا على الأقلّ كي تكون مؤهّلًا لاستخدام الموقع الإلكتروني.

أنت توافق -وبشكل صريح- على جميع شروط الاستخدام وسياسة الخصوصية، وتقرّ وتصرّح بأنّك لن تقوم أنت أو أي شخص أو أي طرف ينوب عنك بتقديم أي دعوى أو شكوى ضد "تووت"، مالكي الموقع الإلكتروني، مديري "تووت"، أعضاء مجلس الإدارة ووكلائهم، المسوّقين بالعمولة التابعين لهم و/أو مَن ينوب عنهم، باستثناء الدعاوى والشكاوى على انتهاكات "تووت" لشروط الاستخدام وسياسة الخصوصية.

يحتفظ "تووت" بالحقّ في تغيير شروط الاستخدام من حين لآخر، وفقًا لتقديره. أي تغيير سيكون ساريًا فقط على الكوبونات المكتَسبة بعد موعد التغيير.

### استخدام الموقع الإلكتروني

#### شروط عامّة

يوفّر الموقع الإلكتروني منصة للتّجار (يُشار إليهم بـ "تجّار") لطرح وعرض كوبونات خصم لموقع إلكتروني معيّن و/أو لعروض (يُشار إليها بـ"كوبونات") محدّدة.

"تووت" لا يقوم ببيع أو توفير المنتَجات أو الخدمات المعروضة على الموقع، والتي من الممكن أن يتم شراؤها من الشركات المختلفة من خلال بيع الكوبونات. المنتَجات أو الخدمات التي تُستخدم في الكوبونات التي يتمّ بيعها على الموقع، تقدّمها وتعرضها الشركاتُ المختلفة لا "تووت".

المستخدِم هو المسؤول المطلق عن حماية سرّيّة كلمة المرور الخاصة به على الموقع و/أو ما يخصّها أو يتعلّق بها. أنت تعلم وتوافق على أنّه قد تكون هناك انقطاعات أو معوقات في الوصول إلى الموقع أو دخول الموقع أو تسجيل الدخول إلى حسابك لأسباب وظروف منها ما يتعلّق ب"تووت" ومنها ما لا علاقة لشركة "تووت" بها. وبموجب هذا فأنت تُعفي "تووت" من أي مسؤولية لتعويضك على أي ضرر و/أو دفوعات و/أو خسارة قد تتكبّدهم أو تتحمّلهم جرّاء ما ذكرناه أعلاه.

يحتفظ "تووت" بالحقّ في تغيير أي ميزة أو خاصية، يشمل أي محتوى كان. قد يوقف "تووت" نشر أي معلومات، أو يغيّر أو يعلّق أي طريقة لنقل المعلومات. وعليه، فأنت تقرّ بأنّك ذو أهلية قانونية كافية لإنشاء عقد ملزِم بموجب القانون.

#### تغيير شروط الاستخدام وسياسة الخصوصية

بالإضافة إلى كلّ إشعار أو تنبيه يُسمح به بموجب هذه الاتفاقية، في حال قام "تووت" بإجراء تغيير على نص شروط الاستخدام، فإنّنا سنقوم بإشعارك أو إخطارك بذلك عبر البريد الإلكتروني أو من خلال نشر إشعار على الموقع لتنبيهك بالتغييرات أو التعديلات. ستكون التغييرات في شروط الاستخدام و/أو سياسة الخصوصية سارية في الحال، على جميع مستخدمي الموقع. استمرارك في استخدام الموقع يمثّل موافقتك على تلك التغييرات وقبولك بها. إذا كنت غير راضٍ عن التعديلات ولا تقبلها، فينبغي عليك التوقّف عن استخدام الموقع في الحال. بالإضافة إلى ذلك، قد يقوم "تووت" بتغيير، تعليق أو توقيف أي جانب من جوانب العرض أو الرابط، أو إزالة، تغيير، أو تعديل أي وسوم أو علامات، محتوى نصَي، محتوى جرافيكي، رسومات أو إعلان بانر أو إعلان راية لهم علاقة بالرابط.

#### المستخدِم

وبما لا يتعارض أو ينتقص ممّا ذكرناه أعلاه، فإن "تووت" قد يمنعك من المشاركة في أي من المبيعات و/أو العروض، أو جزئيًّا، في إحدى الحالات التالية: إذا قمت بانتهاك شروط الاستخدام. إذا قمت بأي عمل أو تجاوُز أو إهمال من شأنه أن يسيء أو يضرّ ب"تووت" أو بأي طرف ثالث، يشمل عملاء الشركة، الشركات والأعمال التجارية والمسوّقين بالعمولة.

#### الملكيّة الفكرية، حقوق النشر، والعلامات التجارية

الموقع الإلكتروني مُلك "تووت" وخاص به فقط. ممنوع منعًا باتًّا نسخ أو توزيع أو إرسال أو نشر أو رَبط أو القيام بأي تعديل آخر على الموقع الإلكتروني بدون موافقة خطيّة صريحة ومسبقة من "تووت".

باستثناء ما منصوص عليه في هذه الاتفاقية، فإنّه لا شيء فيها يمنحك الحقّ في أي من العلامات التجارية، علامات الخدمة، حقوق النشر، براءات الاختراع أو أسرار التجارة الخاصة جميعها ب"تووت". أنت توافق على أنّه يمكن لشركة "تووت" استخدام أي اقتراح من اقتراحاتك أو أي تعليق من تعليقاتك أو أي توصية من توصياتك تختار أن تقدّمهم لشركة "تووت" بدون مقابل. "تووت" يحتفظ بجميع الحقوق التي لم تُذكر ولم تُمنح في هذه الاتفاقية.

#### إخلاء المسؤولية

يوافق المستخدِم على أنّه هو المسؤول المطلق عن استخدامه الموقع الإلكتروني وعن المخاطر المتأتّية عن ذلك. "تووت"، المسوّقون بالعمولة الخاصون به، موظّفوه، وكلاؤه، الشركات التجارية، أطراف ثالثة توفّر المحتوى له والمرخِّصون وجميع المديرين وأعضاء الإدارة والموظّفين والوكلاء فيها، لا يتعّهدون ولا يقرّون بأنّ استخدام الموقع الإلكتروني سيكون خاليًا من الأخطاء أو دون انقطاع في تقديم الخدمات فيه، وكما لا يضمنون دقّة وموثوقيّة وصلاحيّة أي معلومات، خدمات أو كوبونات تُقدَّم وتُطرَح عبر الموقع الإلكتروني.

"تووت" لا يقوم باستيراد، تصنيع، تسويق، بيع و/أو تقديم أي منتج و/أو أي خدمة تقوم أنت بشرائهم من الموقع الإلكتروني، ولذلك فهو لا يتحمّل أي مسؤولية مباشرة أو غير مباشرة على المنتجات، شحن المنتجات و/أو استيرادها إلى الدولة، طبيعة المنتجات، مدى ملاءمتها و/أو مواصفاتها.

يتمّ تقديم المنتجات والخدمات على الموقع الإلكتروني بنيّة حسنة وبمسؤولية من الشركة التجارية، وهي لا تمثّل بأي شكل من الأشكال منتجات موصى بها من "تووت" و/أو رأي "تووت" في المنتجات بغضّ النظر عن طبيعة المنتجات و/أو الخدمات.

لن تكون الشركة مسؤولة عن أي نشاط غير قانوني يقوم به المشارِكون في عمليّة البيع أو أي طرف ثالث آخر ليس في نطاق سيطرتها ومسؤوليتها. وبالإضافة إلى ما ذكر سابقًا وبما لا يتعارض معه، فإنّ "تووت" ليس مسؤولًا ولن يكون مسؤولًا عن أي ضرر يحدث، بشكل مباشر أو غير مباشر، من جرّاء استخدام الموقع الإلكتروني.

#### التعويض

أنتَ توافق بموجب هذه الاتفاقيّة على تعويض "تووت"، عدم إلحاق أي ضرر به والدفاع عن "تووت" وعن عملائه والشركات التابعة لهم، المسوّقين بالعمولة، الشركاء والمرخِّصين، المساهِمين، المديرين، الموظّفين، العاملين، المالكين والوكلاء، ضد جميع الدعاوى، الإجراءات، الطلبات، الالتزامات، الخصوم، الخسائر، الأضرار، الأحكام، التسويات، التكاليف والنفقات (يشمل أتعاب المحامي والنفقات المترتّبة عن ذلك) في الحالات التالية: (1) فشل هذه الاتفاقية أو انتهاكها، يشمل أي خرق للتمثيل، الضمان، الاتفاق، القيود الملزمة أو التعهُّدات. (2) أي سوء استخدام من قِبَل المستخدِم للروابط، الكوبونات، الموقع الإلكتروني و/أو الخدمات أو الملكية الفكرية الخاصة ب"تووت"، أو (3) أي دعوى لها علاقة بأي منتج أو خدمة، وأي دعوى تتعلّق بجودة أي من المنتجات والخدمات.

#### الخصوصية

المستخدِم يقرّ وفقا لهذه الاتفاقية أنّ جميع النقاشات، التصنيفات، التعليقات، خدمة لوحة الإعلانات، غرف الدردشة و/أو جميع البنى التحتية لإرسال الرسائل، المرحلات، والمنشورات على الموقع الإلكتروني (يُشار إليها بـ "المجتمعات") هي عامّة وعلنيّة وليست خاصّة، ما يتيح لأطراف ثالثة الاطّلاع عليها وقراءتها دون علم المستخدِم. "تووت" لا يتحكّم ولا يرعى أي محتوى، رسالة أو معلومات واردة في أي مجتمع من المجتمعات، وعليه فإن "تووت" يقرّ بإخلاء مسؤوليته من كلّ ما يتعلّق بالمجتمعات، ويقرّ أنّه ليس مسؤولا عن أي من التبعات والتداعيات التي تنشأ وتترتّب عن مشاركة المستخدِم في هذه المجتمعات. أي معلومات يقوم المستخدِم بنشرها على الموقع الإلكتروني، سواءٌ أكانت في غرف الدردشة أو غرف المناقشات أو المنتديات أو غير ذلك، ليست معلومات سريّة. من خلال قيامه بنشر التعليقات، الملاحظات و/أو أي معلومات أخرى على الموقع، فإن المستخدِم يمنح "تووت" الحقّ المطلق في استخدام هذه التعليقات، الملاحظات و/أو أي من المعلومات في نشاطاته الترويجية، الإعلانية، أبحاث ودراسات السوق أو لأي غرض قانوني وشرعي آخر بغضّ النظر عن المكان والوقت أو أي قيود أخرى. للمزيد من المعلومات، اقرأ سياسة الخصوصية الخاصة بنا.

#### إنهاء الاتفاقية

يجوز لشركة "تووت" إنهاء الاتفاقية في أيّ وقت، لأي سبب، أو دون أي سبب، وفقًا لتقديره الخاص، ودون أن يكون ملزَمًا بإشعار أو إخطار المستخدِم بذلك.

#### محتوى من أطراف ثالثة

قد يحتوي الموقع الإلكتروني على روابط إلى مواقع إلكترونية خاصة بأطراف ثالثة. يتم توفير هذه الروابط لراحتك فقط، وهي لا تعني موافقة أو مصادقة موقع "تووت" على المحتوى الذي تنشره هذه المواقع الإلكترونية. المستخدِم يدرك تماما أن زيارة مواقع إلكترونية عبر الروابط في موقعنا الإلكتروني قد ينتج عنها أضرار إضافية، تشمل فيروسات، برامج تجسس وبرامج ضارة أخرى. في حال قرّر المستخدِم تسجيل الدخول في موقع إلكتروني خاص بطرف ثالث عبر رابط يظهر في موقعنا الإلكتروني، فإنّه يتحمّل المسؤولية المطلقة عن الأخطار التي قد تنتج عن ذلك.

#### البريد الإلكتروني

أنت تسمح -بموجب هذه الاتفاقية- لشركة "تووت" و/أو لأي شخص ينوب عنه أو من طرفه، بأن يرسلوا إليك رسائل عبر البريد الإلكتروني أو رسائل أخرى عبر وسائط أخرى. أنت تقرّ أيضًا أن "تووت" قد يرسل إليك تنبيهات حول تاريخ انتهاء صلاحية الكوبون الذي قمتَ بشرائه.

بالإضافة إلى ذلك، وبقبولك شروط الاستخدام، أنت توافق على أن "تووت" أو أي شخص ينوب عنه أو من طرفه، قد يقوم بالتواصل معك، من حين لآخر، ليعرض عليك عروض تسويقية وإعلانية، عبر بريد مباشر، رسائل نصيّة، مراسلات عبر البريد الإلكتروني، الإعلانات أو الإشعارات المنبثقة في التطبيق، أو باستخدام أي وسيلة اتصال أخرى.

#### الكوبونات- شروط عامّة

جميع الكوبونات من الموقع الإلكتروني أو عبر الموقع الإلكتروني، يشمل أي موقع إلكتروني مرتبط ب"تووت" (يُشار إليها بـ الـ "كوبونات") هي كوبونات ترويجية يمكن شراؤها من "تووت" من أجل استبدالها بمنتجات و/أو خدمات عبر الحصول على خصم على أسعار المنتجات والخدمات الأساسية (لا يشمل خصومات متعدّدة ومتنوّعة التي تقوم الشركة التجارية بتقديمها من حين لآخر). يمكن شراء الكوبونات على الموقع الإلكتروني بما يتماشى مع الشروط والأحكام المفروضة والسارية على كل صفقة أو معاملة أو نشاط تجاري أو شركة تجارية.

يسمح لك "تووت" بشراء الكوبونات التي يمكن استبدالها بشراء منتجات و/أو خدمات من الشركة التجارية، وفقًا لهذه الشروط والأحكام وشروط الاستخدام من جهة ولشروط الصفقة التجارية المقصودة من جهة أخرى.cالشركات التجارية هي التي تقدّم المنتجات والخدمات وليس "تووت"، وعليه فإن توفير المنتجات والخدمات المناسبة يقع وبشكل مطلق على عاتق هذه الشركات التجارية المختلفة وهو مسؤوليتها المطلقة.

#### معلومات الاتصال

إذا كان لديك أي أسئلة حول هذه الشروط والأحكام، يرجى الاتصال بنا على:
• البريد الإلكتروني: support@tuut.shop
• الموقع الإلكتروني: tuut.shop

آخر تحديث: ${new Date().toLocaleDateString("ar-EG")}
  `;

  const content = isRTL ? arabicContent : englishContent;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {isRTL ? "الشروط والأحكام" : "Terms and Conditions"}
          </h1>
          <div
            className={`prose max-w-none text-gray-700 leading-relaxed ${
              isRTL ? "text-right" : "text-left"
            }`}
            dangerouslySetInnerHTML={{
              __html: content
                .replace(/\n/g, "<br />")
                .replace(
                  /### (.*)/g,
                  '<h3 class="text-xl font-semibold mt-6 mb-3 text-gray-900">$1</h3>'
                )
                .replace(
                  /#### (.*)/g,
                  '<h4 class="text-lg font-medium mt-4 mb-2 text-gray-800">$1</h4>'
                )
                .replace(/• (.*)/g, '<li class="ml-4">$1</li>')
                .replace(
                  /^(\d+)\.\s/gm,
                  '<div class="font-medium mt-3">$1.</div>'
                ),
            }}
          />
        </div>
      </div>
    </div>
  );
}
