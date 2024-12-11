const Home = () => {
  return (
    <><>
      <div className="home-container">
        <h1>Sistema de Gestión Interna</h1>
        <p>Bienvenido al sistema de gestión interna de nuestro taller de bicicletas.</p>
        <p>Utiliza la barra de navegación superior para acceder a las diferentes secciones.</p>
      </div>

      <div className="image-container">
        <img src="https://cdn3d.iconscout.com/3d/premium/thumb/bicicleta-7845702-6275623.png" alt="Imagen de bicicleta de carretera" />
      </div>
    </>
    
    <style>{`
      .home-container {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          padding-top: 150px;
          box-sizing: border-box;
      }

      .home-container h1  {
        font-size: 24px;
        margin-bottom: 10px;
        background: #e0e0e0;
        padding: 10px;
        border-radius: 25px;
      }

      .home-container p {
        font-size: 18px;
        margin-bottom: -15px;
      }

      .image-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 0px;
      }
    `}</style></>
  );
}

export default Home;
