from sqlalchemy import func
from sqlmodel import Session, select

from app.database.database import engine
from app.auth.jwt import hash_password
from app.models.user import User
from app.models.post import Post
from app.models.tag import Tag, PostTag
from app.models.like import Like
from app.models.save import Save
from app.models.comment import Comment


def seed():
    with Session(engine) as session:
        def print_summary() -> None:
            user_count = session.exec(
                select(func.count()).select_from(User)).one()
            post_count = session.exec(
                select(func.count()).select_from(Post)).one()
            tag_count = session.exec(
                select(func.count()).select_from(Tag)).one()
            comment_count = session.exec(
                select(func.count()).select_from(Comment)).one()
            print(
                "Database summary: "
                f"users={user_count}, posts={post_count}, tags={tag_count}, comments={comment_count}"
            )

        def get_or_create_user(username: str, email: str, password: str, display_name: str, bio: str, avatar_url: str) -> User:
            user = session.exec(select(User).where(
                User.username == username)).first()
            if user:
                return user
            user = User(
                username=username,
                email=email,
                password=hash_password(password),
                display_name=display_name,
                bio=bio,
                avatar_url=avatar_url,
            )
            session.add(user)
            session.flush()
            return user

        def get_or_create_tag(name: str) -> Tag:
            tag = session.exec(select(Tag).where(Tag.name == name)).first()
            if tag:
                return tag
            tag = Tag(name=name)
            session.add(tag)
            session.flush()
            return tag

        def get_or_create_post(content: str, author_id: int, image_url: str | None = None) -> Post:
            post = session.exec(select(Post).where(
                Post.content == content, Post.author_id == author_id)).first()
            if post:
                return post
            post = Post(content=content, iamge_url=image_url,
                        author_id=author_id)
            session.add(post)
            session.flush()
            return post

        def link_post_tag(post_id: int, tag_id: int) -> None:
            existing_link = session.get(PostTag, (post_id, tag_id))
            if existing_link is None:
                session.add(PostTag(post_id=post_id, tag_id=tag_id))

        def get_or_create_comment(content: str, author_id: int, post_id: int) -> Comment:
            comment = session.exec(
                select(Comment).where(
                    Comment.content == content,
                    Comment.author_id == author_id,
                    Comment.post_id == post_id,
                )
            ).first()
            if comment:
                return comment
            comment = Comment(
                content=content, author_id=author_id, post_id=post_id)
            session.add(comment)
            session.flush()
            return comment

        def get_or_create_like(user_id: int, post_id: int) -> None:
            existing_like = session.get(Like, (user_id, post_id))
            if existing_like is None:
                session.add(Like(user_id=user_id, post_id=post_id))

        def get_or_create_save(user_id: int, post_id: int) -> None:
            existing_save = session.get(Save, (user_id, post_id))
            if existing_save is None:
                session.add(Save(user_id=user_id, post_id=post_id))

        users = {
            "joao": get_or_create_user("joao", "joao@example.com", "123456", "João Silva", "Backend developer", "https://i.pravatar.cc/150?img=1"),
            "maria": get_or_create_user("maria", "maria@example.com", "123456", "Maria Costa", "Frontend developer", "https://i.pravatar.cc/150?img=2"),
            "pedro": get_or_create_user("pedro", "pedro@example.com", "123456", "Pedro Santos", "Fullstack engineer", "https://i.pravatar.cc/150?img=3"),
        }

        posts = {
            "first": get_or_create_post("Novo cão adotado hoje! #dogs #adoption", users["joao"].id, "https://picsum.photos/600/400?1"),
            "second": get_or_create_post("Gato a descansar depois do banho. #cats #grooming", users["maria"].id, "https://picsum.photos/600/400?2"),
            "third": get_or_create_post("Sessão de treino com o cachorro. #training #puppies", users["pedro"].id, "https://picsum.photos/600/400?3"),
            "fourth": get_or_create_post("Passeio no parque com os patudos. #pets #dogs", users["joao"].id),
            "fifth": get_or_create_post("Resgate de um amigo de quatro patas. #rescue #pets", users["maria"].id, "https://picsum.photos/600/400?5"),
        }

        tags = {name: get_or_create_tag(name) for name in [
            "dogs", "cats", "pets", "adoption", "grooming", "training", "puppies", "rescue"]}

        for post, post_tags in {
            posts["first"].id: [tags["dogs"], tags["adoption"], tags["rescue"]],
            posts["second"].id: [tags["cats"], tags["grooming"]],
            posts["third"].id: [tags["training"], tags["puppies"]],
            posts["fourth"].id: [tags["pets"], tags["dogs"]],
            posts["fifth"].id: [tags["rescue"], tags["pets"]],
        }.items():
            for tag in post_tags:
                link_post_tag(post, tag.id)

        get_or_create_like(users["maria"].id, posts["first"].id)
        get_or_create_like(users["pedro"].id, posts["first"].id)
        get_or_create_like(users["joao"].id, posts["second"].id)
        get_or_create_like(users["pedro"].id, posts["second"].id)
        get_or_create_like(users["joao"].id, posts["third"].id)
        get_or_create_like(users["maria"].id, posts["third"].id)
        get_or_create_like(users["maria"].id, posts["fourth"].id)
        get_or_create_like(users["pedro"].id, posts["fourth"].id)
        get_or_create_like(users["joao"].id, posts["fifth"].id)
        get_or_create_like(users["pedro"].id, posts["fifth"].id)

        get_or_create_save(users["maria"].id, posts["first"].id)
        get_or_create_save(users["pedro"].id, posts["first"].id)
        get_or_create_save(users["joao"].id, posts["second"].id)
        get_or_create_save(users["pedro"].id, posts["second"].id)
        get_or_create_save(users["joao"].id, posts["third"].id)
        get_or_create_save(users["maria"].id, posts["third"].id)
        get_or_create_save(users["maria"].id, posts["fourth"].id)
        get_or_create_save(users["pedro"].id, posts["fourth"].id)
        get_or_create_save(users["joao"].id, posts["fifth"].id)
        get_or_create_save(users["pedro"].id, posts["fifth"].id)

        get_or_create_comment("Lindo! Qual é o nome dele?",
                              users["maria"].id, posts["first"].id)
        get_or_create_comment("Que fofura, adorei a foto.",
                              users["pedro"].id, posts["first"].id)
        get_or_create_comment("Gatinho muito descansado!",
                              users["joao"].id, posts["second"].id)
        get_or_create_comment("Bom trabalho no grooming.",
                              users["pedro"].id, posts["second"].id)
        get_or_create_comment(
            "Treino consistente faz diferença.", users["joao"].id, posts["third"].id)
        get_or_create_comment(
            "Quero ver mais vídeos destes treinos.", users["maria"].id, posts["third"].id)
        get_or_create_comment(
            "Passeio perfeito para gastar energia.", users["pedro"].id, posts["fourth"].id)
        get_or_create_comment(
            "Os nossos patudos também adoram o parque.", users["maria"].id, posts["fourth"].id)
        get_or_create_comment("Resgatar animais muda vidas.",
                              users["joao"].id, posts["fifth"].id)
        get_or_create_comment(
            "Post muito importante, obrigado por partilhares.", users["pedro"].id, posts["fifth"].id)

        session.commit()

        print("Seed completed successfully")
        print_summary()


if __name__ == "__main__":
    seed()
