import Header from "../../components/home/Header"
import ContinueReadingCard from "../../components/home/ContinueReadingCard";
import MainLayout from "../../layouts/MainLayout"

export default function Home(){
    return (
        <MainLayout>
            
            <Header />

            <ContinueReadingCard />

        </MainLayout>
    );
}