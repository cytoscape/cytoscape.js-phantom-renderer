var chai = require('chai');
var expect = chai.expect;
var cytosnap = require('..');
var Promise = require('bluebird');

cytosnap.use([ 'cytoscape-dagre' ]);

describe('Playwright test', function() {
    this.timeout(10000);
    let snap;
    beforeEach(async function(){
        snap = new cytosnap({
            engine: 'playwright',
            playwright: {
                headless: true,
            },
        });
        await snap.start();
    });
    afterEach(async function(){ // teardown
        await snap.stop();
        snap = null;
      });


      it('should save png image', function(done){
        snap.shot({
            elements: [
                {
                    data: {id: 'foo'}
                },
                {
                    data: {id: 'bar'}
                },
                {
                    data: {source: 'foo', target: 'bar'}
                },
            ],
            format: 'png',
            width: 1000,
            height: 1000,
            resolvesTo: 'stream'
        }).then(function (img){
            expect(img).to.exist;
            return img;
        }).then(function (img){
            return new Promise(function (resolve, reject){
                var out = require('fs').createWriteStream('./test/playwrightimg.png');
                img.pipe(out);
                out.on('finish', resolve);
                out.on('error', reject);
            })
        }).then(() => {
            done();
        }).catch(done);
      });
});