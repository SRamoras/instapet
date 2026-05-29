from sqlmodel import SQLModel, Field


class Tag(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)



class PostTag(SQLModel, table=True):
    __tablename__ = "post_tag"
    post_id: int = Field(foreign_key="post.id", primary_key=True)
    tag_id: int = Field(foreign_key="tag.id", primary_key=True)