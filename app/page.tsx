import { fetchContributions, totalContributions } from '@/lib/github';
import AboutMe from './_components/AboutMe';
import Banner from './_components/Banner';
import Experiences from './_components/Experiences';
import GithubActivity from './_components/GithubActivity';
import ProjectList from './_components/ProjectList';
import Skills from './_components/Skills';

// Order is deliberate: proof first (work, then the job), corroboration (GitHub),
// then the reference material (stack) and the human closer (about) before contact.
export default async function Home() {
    const contributions = totalContributions(await fetchContributions());

    return (
        <div className="page-">
            <Banner contributionsLastYear={contributions} />
            <ProjectList />
            <Experiences />
            <GithubActivity />
            <Skills />
            <AboutMe />
        </div>
    );
}
