// import useLanding from './useLanding';
// import Landing1 from '../../components/landing-pages/landing-1';
// import Landing2 from '../../components/landing-pages/landing-2';
// import Landing3 from '../../components/landing-pages/landing-3';
// import Loader from './components/loader';
// import NoData from './components/no-data';

import { fetchCourseForLanding } from "@services/course-service";
import { DOMAIN } from "@utils/constants";
import Landing3 from "@components/landing-pages/landing-3";

const Landing = async () => {

    // const landingData = useLanding();
    // const {
    //     activeLandingPage: { name },
    //     loading,
    //     data,
    //     navigateHomePage
    // } = landingData;

    // if (!data?.id) return <NoData {...{ navigateHomePage }} />;

    const courseData = await fetchCourseForLanding({
                params: {
                    final_url: "s-brain-power",
                    // discount_code: queryParams?.discount_code,
                    domain: DOMAIN
                },
                headers: {
                    'req-from': "in"
                }
            })
    const {data, defaultCoursePrice} = courseData;
    const translatedData = data?.landing_page_translations?.[0] || {};

    if (!data?.id) return <h1>No Data Found</h1>;
    if (!defaultCoursePrice) return <h1>No Price Found</h1>;

    const activeLandingPage = data?.landing_name

    switch (activeLandingPage.name) {
        case 'landing1':
            // return <Landing1 {...{ landingData }} />;
            return <h1>Landing 1</h1>;
        case 'landing2':
            // return <Landing2 {...{ landingData }} />;
            return <h1>Landing 2</h1>;
        case 'landing3':
            return <Landing3 {...{ landingData:{data, translatedData, defaultCoursePrice} }} />;
            return <h1>Landing 3</h1>;
        // default:
        //     return <Loader />;
    }
};

export default Landing;
