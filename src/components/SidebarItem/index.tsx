import classNames from "classnames/bind";
import { FC, useContext } from "react";
import { Link } from "react-router-dom";

import styles from "./SidebarItem.module.scss";
import { SidebarItemProps } from "~/types/sidebar";
import ImageLazy from "../Image";
import ThumbDefault from "../ThumbDefault";
import {AuthContext} from "~/context/AuthContext";

const cx = classNames.bind(styles);

const SidebarItem: FC<SidebarItemProps>=(props) => {
  const {userData}=useContext(AuthContext);

  const { type, thumbnail, icon, name, author, id, artists, view, searchValue, isEpisodes } = props;  

  return (
    <>
      {searchValue ? (
        <>
          {name?.toLowerCase().includes(searchValue.toLowerCase()) && (
            <Link to={type==='collection'? isEpisodes === true ? `/${type}/your-episodes` : `/${type}/track`:`/${type}/${id}`}>
            <div
              className={cx("sidebar-item", {
                "is-compact": view==="Compact",
                "is-grid": view === "Grid",
              })}
            
            >
              {view !== "Compact" && (<div className={cx("thumbnail")}>
                  {thumbnail && (
                    <ImageLazy src={thumbnail} alt={name} />
                  )}
                  {isEpisodes === true && (
                    <div className="episodes-icon">{icon}</div>
                  )}
                  {!thumbnail || !isEpisodes&&(
                    <ThumbDefault />
                  )}
              </div>)}
              <div className={cx("body")}>
                <h4 className={cx("heading")}>
                  {view === "List" && (<h4>{name}</h4>)}
                  {view==="Compact" && (
                    <>
                      <h4 style={{ maxWidth: '60%', textWrap: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {name}
                      </h4>
                      <p>•</p>
                      <p>{type}</p>
                    </>
                  )}
                    {view==="Grid"&&
                      (<h4 style={{textWrap: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{name}</h4>)
                    }
                </h4>
                {view !== "Compact" && (<span className={cx("type")}>
                  {type === 'collection' ? `playlist • ${userData?.display_name}`:`${type} • ${userData?.display_name}`}
                </span>)}
              </div>
            </div>
            </Link>
          )}
        </>
      ):(
         <Link to={type === 'collection' ? isEpisodes === true ? `/${type}/your-episodes` : `/${type}/track` : `/${type}/${id}`}>
          <div
            className={cx("sidebar-item", {
              "is-compact": view==="Compact",
              "is-grid": view === "Grid",
            })}
          
          >
            {view !== "Compact" && (<div className={cx("thumbnail")}>
              {thumbnail && (
                <ImageLazy src={thumbnail} alt={name} />
              )}
              {isEpisodes === true && icon && (
                  <div className={cx("episodes-icon")}>{icon}</div>   
              )}  
              {!thumbnail && !isEpisodes&&(
                  <ThumbDefault />
              )}
            </div>)}
            <div className={cx("body")}>
              <h4 className={cx("heading")}>
                {view === "List" && (<h4>{name}</h4>)}
                {view==="Compact" && (
                  <>
                    <h4 style={{ maxWidth: '60%', textWrap: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {name}
                    </h4>
                    <p>•</p>
                    <p>{type}</p>
                  </>
                )}
                {view === "Grid" && (<h4 style={{ textWrap: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</h4>)}
              </h4>
              {view !== "Compact" && (<span className={cx("type")}>
                  {type === "collection" && `playlist • ${userData?.display_name}`}
                  {type === 'playlist' && `${type} • ${author}`}
                  {type === "artist" && `${type}`}
                  {type === "album" && `${type} • ${artists?.[0]?.name}`}
              </span>)}
            </div>
          </div>
        </Link> 
      )}
    </>
  );
};

export default SidebarItem;
