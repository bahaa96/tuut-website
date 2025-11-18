import { useLanguage } from "../contexts/LanguageContext";
import { useEffect } from "react";

export default function PrivacyPage() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const englishContent = `

### What information we collect, and how we use it.

("Tuut", "we", "us", "our") is committed to protecting the privacy of your personally identifiable information. We provide this privacy policy ("Privacy Policy") in order to explain our online information practices and the choices you can make about the way your information is used by us. You must agree to this Privacy Policy, in its entirety, including our use of cookies in order to register an account ("Account") with "Tuut" website ("Website") and to use the Website. If you do not agree to the "Tuut" Privacy Policy in its entirety, you are not authorized to use the Website.

#### Personally Identifiable Information
We collect personally identifiable information when you register for an Account or otherwise choose to provide personally identifiable information to us. Personally identifiable information is any information that can be used to identify or locate a particular person or entity. This may include but is not limited to: business entity name and/or your title with the applicable business entity, as well as your personal and/or business entity related e-mail address, mailing address, daytime and/or cellular telephone numbers, fax number, account information (or other information that we require in order to pay any amounts due to you under the Website), IP address and/or any other information requested on the applicable Subscriber registration form.

#### Non-Personally Identifiable Information
We will collect certain non-personally identifiable information about you when you visit certain pages of this Website and/or register for an Account on the Website, such as the type of browser you are using (e.g., Chrome, Internet Explorer), the type of operating system you are using, (e.g., Windows or Mac OS) and the domain name of your Internet service provider (ISP) and share such information with our Third-Party Agent. We use the non-personally identifiable information that we collect to improve the design and content of the Website and to enable us to personalize your Internet experience. We also may use this information in the aggregate to analyze Website usage.

#### Cookies and Web Beacons
To enhance your experience with the Website, we use "cookies." Cookies are small packets of data stored on your computer used to store your preferences. Cookies, by themselves, do not tell us your e-mail address or other personally identifiable information. You may set your browser to warn you that cookies are in use, or to block the use of cookies. We use strictly necessary cookies to allow you to move around the Website and log in to your Account, and functional cookies to improve the services and support available to you. Accepting strictly necessary cookies is a condition of using the Website. You can control whether or not functional cookies are used, though preventing them may mean some services and support will be unavailable. Cookies may be managed for us by third parties; where this is the case, we do not allow the third party to use the cookies for any purpose other than as necessary to provide the services. We may additionally collect information using Web beacons, which are commonly referred to in the industry as web bugs, pixel tags or Clear GIFs. Web beacons are electronic images that may be used on the Website, in your Account, or in our emails to deliver cookies, count visits and determine if an email has been opened and acted upon.

#### Use of Information
We use your personally identifiable information: (a) to send you information regarding your Account and the Website; (b) to track your compliance with the Terms and Conditions ("Terms and Conditions"); and/or (c) for validation, suppression, content improvement and feedback purposes. In addition, we may use your IP address for the purposes identified above, as well as to analyze trends, administer the Website, track users' movements, gather broad demographic information for aggregate use, and to confirm that a particular individual affirmed his/her consent to specific legal terms (e.g. a clickwrap license agreement). You agree that we, or our Third Party Agent, may contact you at any time regarding your Account or the Website and/or any other information that we may deem appropriate for you to receive in connection with your Account on the Website. You may update your contact preferences as set forth below.

#### Information Sharing
As a general rule, and other than in connection with the limited exceptions set forth below, we will not sell, share or rent your personally identifiable information to or with non-related parties. Notwithstanding the foregoing, we may share information with 3rd parties, only where we have a lawful basis to do so. In respect of your personal data, the lawful basis for processing may include: where we are required to do so in accordance with legal or regulatory obligations – If we are required to disclose your information by a judicial, governmental or regulatory authority we will do so under the legal basis of complying with mandatory legal requirements imposed on us. where it is in our legitimate interests to process your personal data – in case of a serious abuse of rights of the Privacy Policy or violation of any applicable law, we will share your information with competent authorities and with third parties (such as legal counsels and advisors), for the purpose of handling of the violation under the legal basis of defending and enforcing against violation and breaches that are harmful to our business. Contract performance – where it is necessary for us to process your data in order to establish, operate and manage your account in our website. Legitimate interests – to improve our service and make your experience as enjoyable as possible by conducting technical diagnostics, research analyses and obtaining feedback from time to time, in order to personalize and modify our website and services. We will share your personal data with our trusted vendors, such as Google and Apple, who assist us with marketing optimization, analyzing data, payment processing and analysis of our services.

#### Security
We endeavor to safeguard and protect our Account holders' information. When our website users submit personally identifiable information to the Website, their personally identifiable information is protected both online and offline. When our registration process asks registrants to submit information such as bank account information and/or credit card information ("Sensitive Information"), and when we transmit such Sensitive Information, that Sensitive Information is encrypted and protected. The Third-Party Agent servers that we utilize to store personally identifiable information are kept in a secure physical environment. The Third-Party Agent has security measures in place to protect the loss, misuse and alteration of personally identifiable information stored on its servers. In compliance with applicable federal and state laws, we shall notify and any applicable regulatory agencies in the event that we learn of an information security breach with respect to your personally identifiable information. You will be notified via e-mail in the event of such a breach. Please be advised that notice may be delayed in order to address the needs of law enforcement, determine the scope of network damage, and to engage in remedial measures. You acknowledge that you provide your personally identifiable information to us with knowledgeable consent and at your own risk.

#### Opting Out of Receiving E-mail
You may at any time choose to stop receiving emails containing general information regarding "Tuut" by following the instructions at the end of each such email or by contacting us. Should you be contacted by our Third-Party Agent through email, you can follow the instructions at the end of each such email to stop receiving such emails. There may be a short delay of up to several business days while your request is being verified, deployed and processed across our servers. Notwithstanding the foregoing, we may continue to contact you for the purpose of communicating information relating to your Account, as well as to respond to any inquiry or request made by you.

#### Customer Support Correspondence
Correspondences with our support team will be collected and stored, including your contact details and the information provided by you during the various correspondences, in order to provide support, improve our services and for our exercise or defense of potential legal claims (only for the appropriate period under applicable law).

#### Notification of Changes
We reserve the right to change or update this Privacy Policy at any time by posting a clear and conspicuous notice on the Website explaining that we are changing our Privacy Policy. All Privacy Policy changes will take effect immediately upon their posting on the Website. Please check the Website periodically for any changes. Your continued use of the Website and/or acceptance of our e-mail communications following the posting of changes to this Privacy Policy will constitute your acceptance of any and all changes.

#### Comments and Questions
If you have any comments or questions about our privacy policy, please contact us.
  `;

  const arabicContent = `

موقِعُنا "توت" (نحن في "توت" ) يَلتزُم بحمايةِ خصوصيّة بياناتك الشّخصية, وسريّة معلوماتك الشخصية. ونحنُ في هذا البيان نُحيطكَ علماً بِسياسَتنا بشأن هذه الخصوصية (سياسة الخُصوصيّة), لنوضّح لك أُسلوب ممارساتنا وتعاملاتنا مع هذه المعلومات عبر الإنترنت, ولكي نحدّد لك حقوقك والبدائلَ المتاحة لك فيما يتعلّق بطريقة استعمالنا لمعلوماتك تلك. يتوجّبُ عليك مصادقة هذه السّياسة والموافقة عليها بأكملِها وبما في ذلك استخدامنا لِ كوكيز (ملفات تعريف الارتباط cookies) في حالة عدم موافقتك على سياسة الخصوصية هذه بكاملها، فلا يسمحُ لك باستخدام موقع "توت" أو التطبيق على حدّ سواء.

## معلومات التعريف الشخصيّة

اننا نجمع معلوماتك الشخصيّة حينما تدخل وتنضم وتستخدم عروض وخدمات "توت", أو يمكنك بالمقابل تقديم معلوماتك الشخصية لنا مباشرة  إن فضّلت ذلك. المقصودُ هنا بمعلومات التّعريفِ الشّخصية هوَ أيّة معلوماتٍ يمكن استخدامها للتّعريف عنك أو عن كيان تجاري معيّن وأيضاً تحديدُ موقعك. قد يشمل ذلك على سبيل المثال لا الحصر: اسم الكيان التجاري و / أو تعريف مركزك في الكيان التجاري. وكذلك عنوان البريد الإلكتروني الخاص بك و / أو البريد الإلكتروني للكيان التجاري ذي الصلة ، والعنوان البريدي ، و رقم هاتفك في خلال ساعات النهار و / أو أرقام الهواتف الخلوية ، رقم الفاكس أو تفاصيل الحساب أو عنوان IP  الذي يحتوي على البروتوكول أو السّجل الإنترنتي الخاص بك/ أو أي معلومات أخرى مطلوبة بشأن التسجيل المشترك في نموذج التعبئة.

### معلومات ليست للتعريف الشّخصي

إننا نقوم بجمع معلوماتٍ معينة أخرى عنك لا تحمل الطابع الشخصيّ لحظة دخولك موقع "توت"  و / أو زيارتك لصفحاتٍ معينة في هذا الموقع ، مثلُ نوعِ المتصفّح الذي تستخدمه, (على سبيل المثال، Chrome ، Internet Explorer ) ونوعُ نظام التشغيل الذي تستخدمه, على سبيل المثال, Windows  أو Mac OS واسم المجال الخاص بتزويدك خدمات الإنترنت (ISP) ومن الممكن أن نشارك هذه المعلومات مع وكيل الطرف الثالث الخاص بنا. نحن نستخدم المعلومات غير الشخصية التي نجمعها لتحسين تصميم ومحتوى الموقع, و لتمكيننا من ملاءمة وتطابق الموقع  لتجربتك الإنترنتية الخاصة بك. يجوز لنا أيضًا استخدام مجموعة المعلومات المتراكمة في المجمل لتحليل استخدام الموقع.

### الكوكيز ومنارات الويب

لتحسين تجربتك مع الموقع ، نستخدم كوكيز وهي عبارة عن حزم صغيرة من البيانات المخزنة على حاسوبك المستخدمة لتخزين تفضيلاتك. كوكيز, في حد ذاتها, لا تدلنا عنوان بريدك الإلكتروني أو غيرها من المعلومات الشخصية. يمكنك إعداد المتصفح ليقوم بتحذيرك من استخدام كوكيز, أو الحظر وإلغاء استخدام كوكيز نهائياً. نستخدم كوكيز الضرورية فقط وذلك لتمكينك التحرك في الموقع والدخول إلى حسابك, وكوكيز الوظيفية قد نستخدمها لهدف تحسين الخدمات وتقديم الدّعم المناسب لك. إنّ قبولك لاستخدامنا كوكيز هو شرط لاستخدامك الموقع. يمكنك التحكم في استخدام كوكيز الوظيفية أم لا, ولكن خذ بعين الاعتبار أن منعها قد يعني أن بعض الخدمات والدعم لن يكون متاحًا. وقد نطلب من  إدارة كوكيز لنا بواسطة أطراف ثالثة. في هذه الحالة ، لا نسمح للطرف الثالث باستخدام كوكيز لأيّ غرضٍ آخر غير ضروري سوى تقديم الخدمات. وقد نقوم أيضًا بجمع المعلومات باستخدام إشارات الويب, والتي يشار إليها عادة في الصناعة مثل عوامل الخلل في الويب أو علامات البكسل أو ملفات GIF. منارات الويب هي صور إلكترونية يمكن استخدامها على الموقع, في حسابك, أو في رسائل البريد الإلكتروني الخاصة بنا لتقديم كوكيز, وحساب الزيارات وتحديد ما إذا كان قد تم فتح بريد إلكتروني وتم التصرف بناءً عليه.

### استخدام المعلومات

نستخدم معلوماتك الشخصية: لتتبع امتثالك للشروط والأحكام ("الشروط والأحكام") ؛  و / أو للتصديق, القمع, , تحسين المحتوى ولمعرفة التعليقات وردود الفعل المختلفة. بالإضافة إلى ذلك ، قد نستخدم عنوان IP  الخاص بك للأغراض المحددة أعلاه, بالإضافة إلى تحليل الاتجاهات الدارجة على نطاق واسع وإدارة الموقع وتتبع حركات المستخدمين وجمع معلومات ديموغرافية واسعة للاستخدام الكلي وتأكيد موافقته على شروط قانونية محددة. على سبيل المثال (اتفاقية ترخيص clickwrap – مجموعة النقرات). أنت ملزم أن توافق على أننا, قد نتصل بك في أي وقت بخصوص أي معلومات أخرى قد نعتبرها مناسبة لتتلقى. يمكنك تحديث تفضيلات الاتصال الخاصة بك كما هو موضح أدناه و وتأكيد ذلك على وجه الخصوص نتأكد أن الشخص موافقته على شروط قانونية محددة. يمكنك إعلامنا بأي تحديث أو تفضيلات الاتصال الخاصة بك كما هو موضح أدناه.

### مشاركة المعلومات
كقاعدة عامة, عدا الاستثناءات التي سيتم طرحها, لن يجوز لنا بيع معلوماتك الشخصية, مشاركتها أو تأجيرها للآخرين. بغض النظر عما سبق, قد نشارك معلوماتك مع أطراف ثالثة, وذلك فقط عندما يكون لدينا أساس قانوني للقيام بذلك. فيما يتعلق ببياناتك الشخصية, قد يتضمن الأساس القانوني للمعالجة: أنّه حيث يُطلب منا القيام بذلك وفقًا لالتزامات قانونية أو تنظيمية – إذا طُلب منا الكشف عن معلوماتك من قبل سلطة قضائية أو حكومية أو تنظيمية, فسنضطر لفعل ذلك بموجب المتطلبات القانونية الإلزامية المفروضة علينا. إذا كان من مصلحتنا الشرعية معالجة بياناتك الشخصية – في حالة حدوث انتهاك خطير لحقوق الخصوصية أو انتهاك أي قانون سارٍ, سنقوم بمشاركة معلوماتك مع السلطات المختصة ومع أطراف ثالثة (مثل المستشار القانوني و المستشارين), لغرض التعامل مع الانتهاك بموجب الأساس القانوني للدفاع والتنفيذ ضد المخالفات التي تضر بعملنا.

### تَأدية العقد
الاهتمامات المشروعة – لتحسين خدماتنا وجعل تجربتك ممتعة قدر الإمكان عن طريق إجراء التشخيص التقني, وتحليلات الأبحاث والحصول على ردود الفعل والتعليقات من وقت لآخر, بهدف جعل موقعنا شخصياً أكثر ومن أجل تعديل الموقع  وخدماتنا سنشارك بياناتك الشخصية مع موردينا الموثوقين, أمثال جوجل و أبل, الذين يساعدوننا في تحسين التسويق, تحليل البيانات, ومعالجة عمليات الدفع وتحليل خدماتنا.

### الأمن
نحن نسعى لحماية معلومات أصحاب الحسابات لدينا. عندما يقوم مستخدمو موقع الويب الخاص بنا بتقديم معلومات تعريف شخصية إلى شبكة الشركات التابعة ، فإن معلومات التعريف الشخصية الخاصة بهم محمية داخل الإنترنت وخارجه. أثناء عملية التسجيل, حين نطلب من المسجلين تقديم معلومات عن الحساب البنكي- المصرفي و / أو معلومات بطاقة الائتمان ("المعلومات الحساسة"), وعندما نقوم بنقل هذه المعلومات الحساسة ، يتم تشفير المعلومات الحساسة وحمايتها. خدمات وكلاء الطرف الثالث التي نستخدمها لتخزين معلومات التعريف الشخصية يتم الاحتفاظ بها في بيئة مادية آمنة. خدمات وكلاء الطرف الثالث تقوم بإجراءات أمنية لحماية فقدان المعلومات الشخصية التي يتم تخزينها, في حالة سوء استخدامها, وتعديلها. امتثالًا للقوانين الفيدرالية والمدنيّة المعمول بها ، سنقوم بإبلاغ الجهات التنظيمية سارية في حال علمنا بخرق أمن المعلومات فيما يتعلق بمعلومات التعريف الشخصية الخاصة بك. وسيتم إعلامُكَ عبر البريد الإلكتروني في حالة حدوث مثل هذا الخرق. يرجى العلم بأن الإخطار قد يتأخر فترة من أجل تلبية احتياجات تنفيذ القانون ، وتحديد نطاق ضرر الحادث للشبكة, والقيام بالتدابير العلاجية. عليك أن تقرّ أنك تزودنا بمعلوماتك الشخصية بموافقتك وبعد اطلاع وعلى مسؤوليتك الخاصة.

### إلغاء الاشتراك في تلقي البريد الإلكتروني

في أي وقت تختار, يمكنك إيقاف تلقي رسائل البريد الإلكتروني التي تحتوي على معلومات عامة بخصوص  المُــوفـّــر وذلك باتباع التعليمات الواردة في نهاية كل بريد إلكتروني أو عن طريق الاتصال بنا. إذا اتصل بك وكيل الطرف الثالث عبر البريد الإلكتروني فيمكنك اتباع التعليمات الواردة في نهاية كل بريد إلكتروني لإيقاف تلقي مثل هذه الرسائل الإلكترونية. قد يكون هناك تأخير قصير يصل إلى عدة أيام عمل أثناء التحقق من طلبك ونشره ومعالجته في جميع أنحاء موقعنا.  بغض النظر عما سبق ، يجوز لنا الاستمرار في الاتصال بك لغرض توصيل المعلومات المتعلقة بحسابك ، وكذلك الرد على أي استفسار أو طلب تقدمت به.

### المراسلات لدعم العملاء

سيتم تجميع المراسلات مع فريق الدعم لدينا وتخزينها ، بما في ذلك تفاصيل الاتصال الخاصة بك والمعلومات التي قدمتها خلال المراسلات المختلفة ، من أجل تقديم الدعم ، وتحسين خدماتنا وممارستنا أو الدفاع عن المطالبات القانونية المحتملة (فقط لفترة بموجب القانون المعمول به).

### الإخطار بالتغييرات

نحن نحتفظ بحقنا في تغيير أو تحديث سياسة الخصوصية هذه في أي وقت من خلال نشر إشعار واضح وملحوظ على الموقع يشرح أننا نقوم بتغيير سياسة الخصوصية الخاصة بنا. سيتم تفعيل جميع تغييرات سياسة الخصوصية فور نشرها على الموقع. يرجى التحقق من الموقع بشكل دوري لأية تغييرات. إن استمرارك في استخدام الموقع و / أو قبول اتصالاتنا عبر البريد الإلكتروني بعد نشر التغييرات على سياسة الخصوصية هذه سيشكل موافقتك على أي وجميع التغييرات.

### التعليقات والأسئلة
إذا كان لديك أيّة تعليقات أو أسئلة حول سياسة الخصوصية الخاصة بنا ، يرجى الاتصال بالدعم هنا.
  `;

  const content = isRTL ? arabicContent : englishContent;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
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
