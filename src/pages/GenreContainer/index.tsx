import { FC, useEffect, useRef, useState } from "react";
import styles from "./GenreContainer.module.scss";
import classNames from "classnames/bind";
import { useParams } from "react-router-dom";

import { useInView } from "react-intersection-observer";
import { CategoryItem } from "~/types/search";
import { PlaylistData } from "~/types/playlist";
import useComponentSize from "~/hook/useComponentSize";
import { getCategoryInfo, getCategoryPlaylist } from "~/services/categoriesApi";
import Section from "~/components/Section";
import { ResponseSectionItem } from "~/types/section";
import Footer from "~/components/Footer";
import Header from "~/components/Header";

const cx = classNames.bind(styles);

const GenreContainer: FC = () => {
  const [info, setInfo] = useState<CategoryItem>();
  const [data, setData] = useState<PlaylistData[]>([]);
  const [renderNumb, setRenderNumb] = useState<number>(19);
  const [totalPlaylist, setTotalPlaylist] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(true);
  const { ref: lazyLoadingRef, inView: lazyLoadingInView } = useInView({
    threshold: 0,
  });

  const { id } = useParams();

  useEffect(() => {
    const fetchInfo = async () => {
      const data = await getCategoryInfo({ id });
      setInfo({ ...data });
    };

    fetchInfo();
  }, [id]);

  useEffect(() => {
    const fetchInitData = async () => {
      const data = await getCategoryPlaylist({
        id,
        limit: renderNumb,
        offset: 0,
      });


      setTotalPlaylist(data?.playlists?.total ?? 0);
      const dataNormalized = data?.playlists?.items?.filter(
        (item: any) => item,
      );
      setData([...dataNormalized]);
    };
    fetchInitData();
  }, [id]);

  useEffect(() => {
    if (!lazyLoadingInView || totalPlaylist === 0) {
      return;
    }

    if (totalPlaylist > renderNumb) {
      const fetchData = async () => {
        const data = await getCategoryPlaylist({
          id,
          limit: 18,
          offset: renderNumb,
        });
        const dataNormalized = data?.playlists?.items?.filter(
          (item: any) => item,
        );
        setData((prev) => [...prev, ...dataNormalized]);
        if (renderNumb + 18 > totalPlaylist) {
          setRenderNumb(totalPlaylist);
        } else {
          setRenderNumb(renderNumb + 18);
        }
      };
      fetchData();
    }
  }, [lazyLoadingInView]);

  useEffect(() => {
    if (info && data?.length !== 0) {
      setLoading(false);
    } else setLoading(true);
  }, [data, info]);
  
  return (
    <div className={cx("wrapper")}>
      <Header type="genre" />
      <div className={cx("body")}>
        <Section
          apiType="spotify"
          dataType="playlist"
          title={info?.name}
          data={data as ResponseSectionItem[]}
          isFull={true}
          isClickable={false}
          pageType="genre"
        />
        <Footer />
      </div>
    </div>
  );
};

export default GenreContainer;
