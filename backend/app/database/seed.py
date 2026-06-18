from sqlalchemy import func
from sqlmodel import Session, select

from app.database.database import engine, create_db
from app.auth.jwt import hash_password
from app.models.user import User
from app.models.post import Post
from app.models.tag import Tag, PostTag
from app.models.like import Like
from app.models.save import Save
from app.models.comment import Comment


def seed():
    create_db()  # 🔥 IMPORTANTE: garante tabelas

    with Session(engine) as session:

        def print_summary() -> None:
            user_count = session.exec(select(func.count()).select_from(User)).one()
            post_count = session.exec(select(func.count()).select_from(Post)).one()
            tag_count = session.exec(select(func.count()).select_from(Tag)).one()
            comment_count = session.exec(select(func.count()).select_from(Comment)).one()

            print(
                f"Database summary: users={user_count}, posts={post_count}, tags={tag_count}, comments={comment_count}"
            )

        def get_or_create_user(username: str, email: str, password: str, display_name: str, bio: str, avatar_url: str) -> User:
            user = session.exec(select(User).where(User.username == username)).first()
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
            post = session.exec(
                select(Post).where(Post.content == content, Post.author_id == author_id)
            ).first()

            if post:
                return post

            post = Post(content=content, image_url=image_url, author_id=author_id)
            session.add(post)
            session.flush()
            return post

        def link_post_tag(post_id: int, tag_id: int) -> None:
            existing = session.get(PostTag, (post_id, tag_id))
            if not existing:
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

            comment = Comment(content=content, author_id=author_id, post_id=post_id)
            session.add(comment)
            session.flush()
            return comment

        def get_or_create_like(user_id: int, post_id: int) -> None:
            if not session.get(Like, (user_id, post_id)):
                session.add(Like(user_id=user_id, post_id=post_id))

        def get_or_create_save(user_id: int, post_id: int) -> None:
            if not session.get(Save, (user_id, post_id)):
                session.add(Save(user_id=user_id, post_id=post_id))

        # ── USERS ─────────────────────
        users = {
            "joao": get_or_create_user(
                "joao",
                "joao@example.com",
                "123456",
                "João Silva",
                "🐶 Pai do Max e da Luna | Voluntário no abrigo local | Adotar é amar",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            ),
            "maria": get_or_create_user(
                "maria",
                "maria@example.com",
                "123456",
                "Maria Costa",
                "🐱 Mãe da Mimi e do Simba | Apaixonada por gatos | Resgate animal",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
            ),
            "pedro": get_or_create_user(
                "pedro",
                "pedro@example.com",
                "123456",
                "Pedro Santos",
                "🐾 Treinador canino certificado | Dicas de treino e comportamento animal",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            ),
        }

        # ── POSTS ─────────────────────
        posts = {
            "first": get_or_create_post(
                "Novo membro da família! 🐶 Adotámos o Max hoje no abrigo. Não consigo parar de sorrir! #dogs #adoption",
                users["joao"].id,
                "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop",
            ),
            "second": get_or_create_post(
                "A Mimi depois do banho… não me perdoa tão cedo 😂🐱 #cats #grooming",
                users["maria"].id,
                "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop",
            ),
            "third": get_or_create_post(
                "Sessão de treino com o Rocky! Já aprendeu o 'senta' e o 'dá a pata' 🐕‍🦺💪 #training #puppies",
                users["pedro"].id,
                "https://images.unsplash.com/photo-1587559070757-f72a388edbba?w=600&h=400&fit=crop",
            ),
            "fourth": get_or_create_post(
                "Passeio no parque ao pôr do sol com a Luna 🌅🐾 Nada melhor que isto! #pets #dogs",
                users["joao"].id,
                "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&h=400&fit=crop",
            ),
            "fifth": get_or_create_post(
                "Resgatámos este pequenote da rua. Agora tem casa e muito amor ❤️🐱 #rescue #pets",
                users["maria"].id,
                "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&h=400&fit=crop",
            ),
        }

        # ── TAGS ─────────────────────
        tags = {name: get_or_create_tag(name) for name in [
            "dogs", "cats", "pets", "adoption", "grooming", "training", "puppies", "rescue"]}

        # ── LINKS ─────────────────────
        mapping = {
            posts["first"].id: [tags["dogs"], tags["adoption"], tags["rescue"]],
            posts["second"].id: [tags["cats"], tags["grooming"]],
            posts["third"].id: [tags["training"], tags["puppies"]],
            posts["fourth"].id: [tags["pets"], tags["dogs"]],
            posts["fifth"].id: [tags["rescue"], tags["pets"], tags["cats"]],
        }

        for post_id, post_tags in mapping.items():
            for tag in post_tags:
                link_post_tag(post_id, tag.id)

        # ── LIKES ─────────────────────
        get_or_create_like(users["maria"].id, posts["first"].id)
        get_or_create_like(users["pedro"].id, posts["first"].id)
        get_or_create_like(users["joao"].id, posts["second"].id)
        get_or_create_like(users["joao"].id, posts["fifth"].id)
        get_or_create_like(users["pedro"].id, posts["fifth"].id)

        # ── SAVES ─────────────────────
        get_or_create_save(users["maria"].id, posts["first"].id)
        get_or_create_save(users["pedro"].id, posts["third"].id)
        get_or_create_save(users["joao"].id, posts["fifth"].id)

        # ── COMMENTS ─────────────────────
        get_or_create_comment("Que lindo! Parabéns pela adoção 🎉", users["maria"].id, posts["first"].id)
        get_or_create_comment("Bem-vindo Max! 🐶❤️", users["pedro"].id, posts["first"].id)
        get_or_create_comment("Hahaha a cara dela diz tudo 😂", users["joao"].id, posts["second"].id)
        get_or_create_comment("Bom trabalho Rocky! 💪🐕", users["maria"].id, posts["third"].id)
        get_or_create_comment("Que herói! Obrigado por salvares este pequenote 🙏", users["joao"].id, posts["fifth"].id)
        get_or_create_comment("Adotar salva vidas ❤️", users["pedro"].id, posts["fifth"].id)

        session.commit()

        print("Seed completed successfully 🐾")
        print_summary()


if __name__ == "__main__":
    seed()