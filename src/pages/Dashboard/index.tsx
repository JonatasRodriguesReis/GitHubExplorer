import React, {useState, useEffect ,FormEvent} from 'react';
import { Link } from 'react-router-dom';
import { Title, Form, Repositories, Error} from './styles';
import logoImage from '../../assets/Logo.svg';
import { FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

interface Repository{
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    }
}

const Dashboard: React.FC= ()=>{
    const [newRepository, addNewRepository] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>(()=>{
        const storageRepositories = localStorage.getItem('@GithubExplorer:repositories');

        if(storageRepositories)
            return JSON.parse(storageRepositories);
        return []
    });
    const [inputError,setInputError] = useState('');

    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositories',JSON.stringify(repositories))
    },[repositories])


    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void>{
        event.preventDefault();

        if(!newRepository){
            setInputError('Enter with name of repository!');
            return
        }
        
        try{
            const response = await api.get<Repository>(`repos/${newRepository}`);
            const repository = response.data    ;
            setRepositories([...repositories,repository]);

            addNewRepository('');
            setInputError('');
        }catch{
            setInputError('Repository does not exist!');
        }
        
    }

    return (
        <>
            <img src={logoImage} alt="Github Explorer"/>
            <Title>Explore repositórios no GitHub</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input type="text" value={newRepository} onChange={(e) => addNewRepository(e.target.value)} placeholder="Digite o nome do repositório"></input>
                <button type="submit">Pesquisar</button>
            </Form>

            { inputError && <Error>{inputError}</Error> }

            <Repositories>
                {repositories.map((repository) => (
                    <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
                        <img
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login}
                        />

                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>

                        <FiChevronRight size={20}></FiChevronRight>
                    </Link>
                ))}
            </Repositories>
        </>
    );
}

export default Dashboard;