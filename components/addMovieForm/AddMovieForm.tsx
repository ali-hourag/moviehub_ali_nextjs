"use client"
import { createMovie } from '@/actions/movies.action';
import { getAllGenres } from '@/services/genres.services';
import { GenresType } from '@/types/genres';
import { MoviesType } from '@/types/movies';
import { UsersType } from '@/types/users';
import { revalidateTag } from 'next/cache';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

type Props = {
    user: UsersType,
    genres: GenresType[]
}

const AddMovieForm = (props: Props) => {
    const { user, genres } = props;
    // const [genres, setGenres] = useState<GenresType[]>([]);
    const [currentUser, setCurrentUser] = useState<UsersType | null>(null);
    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            name: "",
            score: "",
            year: "",
            genre: "",
            image: ""
        }
    })


    const submitForm = () => {

        //Upload image
        const name = watch("name")
        const year = parseInt(watch("year"))
        const score = parseInt(watch("score"))
        const genre = watch("genre")
        // console.log(name);
        // console.log(score);
        // console.log(year);
        // console.log(genre);

        const trackImgFileList = watch("image");
        const trackImgFile = trackImgFileList[0];
        // console.log(trackImgFile);
        const movieFormData = new FormData();
        movieFormData.append("name", name)
        movieFormData.append("year", year.toString());
        movieFormData.append("score", score.toString());
        movieFormData.append("genres", genre);
        movieFormData.append("image", trackImgFile);

        (async function fetchUpdates() {
            //Coger user by Id and send id movie and genre and it will be created
            const userId = user.id;
            console.log(userId);
            if (userId) {
                const movieCreated = await createMovie(movieFormData, userId)
                console.log(movieCreated);
            }
        }())
        toast.success('Successfully uploaded!')
    }
    useEffect(() => {
        setCurrentUser(user);
    }, [])
    return (
        <div>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <h3 className="addmovie-title">ADD MOVIE</h3>
            <form className="addmovie-form" onSubmit={handleSubmit(submitForm)}>
                <div className="addmovie-entry-container">
                    <label htmlFor="addmovie-name" className="addmovie-name_label addmovie_label">
                        Name:
                    </label>
                    <input id="addmovie-name"
                        className="addmovie-name_input addmovie_input" type="text"
                        {...register("name", {
                            required: {
                                value: true,
                                message: "Name is required."
                            },
                            minLength: {
                                value: 2,
                                message: "Use 2 or more chararacters."
                            },
                            maxLength: {
                                value: 25,
                                message: "Name is too long."
                            }
                        })}
                    />
                    {errors.name && <p className="addmovie-form-error">{errors.name.message}</p>}
                </div>
                <div className="addmovie-entry-container">
                    <label htmlFor="addmovie-score" className="addmovie-score_label addmovie_label">
                        Score:
                    </label>
                    <input id="addmovie-score"
                        className="addmovie-score_input addmovie_input"
                        type="number" step="0.1" min="0" max="5"
                        {...register("score", {
                            required: {
                                value: true,
                                message: "Score is required."
                            }
                        })}
                    />
                    {errors.score && <p className="addmovie-form-error">{errors.score.message}</p>}

                </div>
                <div className="addmovie-entry-container">
                    <label htmlFor="addmovie-year" className="addmovie-year_label addmovie_label">
                        Year:
                    </label>
                    <input id="addmovie-year"
                        className="addmovie-year_input addmovie_input"
                        type="number" min="1895" max="2023"
                        {...register("year", {
                            required: {
                                value: true,
                                message: "Year is required."
                            }
                        })}
                    />
                    {errors.year && <p className="addmovie-form-error">{errors.year.message}</p>}

                </div>
                <div className="addmovie-entry-container">
                    <label htmlFor="addmovie-select-genre" className="addmovie-genre_label addmovie_label">
                        Select a genre for your song
                    </label>
                    <select className="addmovie-genre-select" id="addmovie-select-genre"
                        {...register("genre", {
                            required: {
                                value: true,
                                message: "Genre selection is required"
                            }
                        })}
                    >
                        <option value="" disabled hidden>Select a genre for your song</option>
                        {genres && genres.map((genre, index) => (
                            <option value={genre.name} key={index}>{genre.name}</option>
                        ))}
                    </select>
                    {errors.genre && <p className="addmovie-form-error">{errors.genre.message}</p>}
                </div>
                <div className="addmovie-entry-container">
                    <label htmlFor="addmovie-image" className="addmovie-image_label addmovie_label">
                        Select a cover:
                    </label>
                    <input id="addmovie-image"
                        className="addmovie-image_input addmovie_input"
                        type="file"
                        accept="image/jpeg, image/jpg image/webp"
                        placeholder="Select an image cover..."
                        {...register("image", {
                            required: {
                                value: true,
                                message: "Image is required"
                            }
                        })}
                    />
                    {errors.image && <p className="addmovie-form-error">{errors.image.message}</p>}
                </div>
                <div className="addmovie-entry-container">
                    <button className="add-movie-submit_btn" type="submit">Upload</button>
                </div>
            </form>
        </div>
    )
}

export default AddMovieForm