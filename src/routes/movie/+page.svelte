<script>
    // Szükség esetén állapotváltozók vagy funkciók itt definiálhatók
</script>

<style>
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
    }
    #main {
        display: flex;
        gap: 20px; 
        padding: 20px;
        background-color: #FFF2D7;
    }
    #pic {
        flex: 1;
    }
    #pic img {
        max-width: 100%; 
        display: block;
    }
    #content {
        flex: 2;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    #about {
        flex: none;
    }
    #addcomment .wrapper {
        border: 1px solid #ccc;
        padding: 15px;
        border-radius: 5px;
        background-color: #f9f9f9;
    }
    #addcomment .title {
        font-size: 1.2em;
        margin-bottom: 10px;
        font-weight: bold;
    }
    #addcomment textarea {
        width: 100%;
        margin-top: 10px;
        resize: none;
        padding: 10px;
    }
    #addcomment .submit-btn {
        margin-top: 10px;
        background-color: #007bff;
        color: white;
        text-align: center;
        padding: 10px;
        cursor: pointer;
        border-radius: 5px;
    }
    .wrapper {
        background-color: #FF7D29;
        width: 100%;
        padding: 0.3rem 0.6rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.3rem;
        border-radius: 0.25rem;
        box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 1;
    }
    .wrapper .title {
        font-weight: bold;
        font-size: 0.36rem;
    }
    .wrapper .content {
        line-height: 1.6;
        color: #FFF2D7;
    }
    .rate-box {
        display: flex;
        flex-direction: row-reverse;
        gap: 0.1rem;
    }
    .rate-box input {
        display: none;
    }
    .rate-box input:hover ~ .star:before {
        color: rgba(255, 204, 51, 0.5);
    }
    .rate-box input:active + .star:before {
        transform: scale(0.9);
    }
    .rate-box input:checked ~ .star:before {
        color: #ffcc33;
        text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8);
    }
    .rate-box .star:before {
        content: "★";
        display: inline-block;
        font-family: "Potta One", cursive;
        font-size: 25px;
        cursor: pointer;
        color: #0000;
        text-shadow: 2px 2px 3px rgba(255, 255, 255, 0.5);
        background-color: #aaa;
        background-clip: text;
        -webkit-background-clip: text;
        transition: all 0.3s;
    }
    textarea {
        border: none;
        resize: none;
        width: 100%;
        padding: 0.2rem;
        color: inherit;
        font-family: inherit;
        line-height: 1.5;
        border-radius: 0.2rem;
        box-shadow: inset 2px 2px 8px rgba(0, 0, 0, 0.3), inset -2px -2px 8px rgba(255, 255, 255, 0.8);
        background-color: rgba(255, 255, 255, 0.3);
    }
    textarea::placeholder {
        color: #aaa;
    }
    textarea:focus {
        outline-color: #ffcc33;
    }
    .btn {
        padding: 0.2rem 0.5rem;
        box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.3), -3px -3px 8px rgba(255, 255, 255, 0.8);
        /* border-radius: 1rem; */
        cursor: pointer;
        background-color: #FFBF78;
        transition: all 0.2s;
        width: 250px;
        color: #FF7D29;
    }
    .btn:active {
        transform: translate(2px, 2px);
    }
    #addcomment .wrapper {
    background-color: #FF7D29 !important;
}
h1, .th, .title, td{
    color: #FFBF78;
}
.table{
    border: 1px solid #FF7D29;
}
th, td{
    background-color: #FFF2D7;
}
p, small{
    color: #FF7D29;
}


</style>

<div id="main">
    <div id="pic">
        <img src="https://via.placeholder.com/500x700" alt="A film/sorozat képe" />
    </div>
    <div id="content">
        <div id="about">
            <h1>Cím</h1>
            <p><small>YYYY</small> (<small>műfaj</small>)<br /></p>
            <small>mmm mins</small><br />
            <div id="description">
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur sint debitis architecto quia voluptatibus obcaecati laudantium ut recusandae voluptatem. Exercitationem non harum deserunt unde suscipit adipisci pariatur blanditiis nisi earum.</p>
                <div id="people">
                    <table class="table">
                        <tbody>
                            <tr>
                                <th scope="row" class="th">Director</th>
                                <td>John Doe</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <th scope="row" class="th">Actors</th>
                                <td>Jane Doe</td>
                                <td>Karren Koe</td>
                                <td>Mary Major</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div id="addcomment">
            <div class="wrapper">
                <div class="title">Osszd meg véleményed</div>
                <div class="content">Hogy tetszett amit láttál? Írd meg kommentben!</div>
                <div class="rate-box">
                    <input type="radio" name="star" id="star0" />
                    <label class="star" for="star0"></label>
                    <input type="radio" name="star" id="star1" />
                    <label class="star" for="star1"></label>
                    <input type="radio" name="star" id="star2" checked />
                    <label class="star" for="star2"></label>
                    <input type="radio" name="star" id="star3" />
                    <label class="star" for="star3"></label>
                    <input type="radio" name="star" id="star4" />
                    <label class="star" for="star4"></label>
                </div>
                <textarea cols="24" rows="5" placeholder=""></textarea>
                <div class="btn mt-3">Küldés</div>
            </div>
        </div>
    </div>
</div>
